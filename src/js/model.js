import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';
import { API_KEY } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    }
  } catch (err) {
    throw err;
    // console.error(`${err}💥💥💥`);
  }
};
export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    const recipes = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.results = recipes;
    state.search.query = query;
    state.search.page = 1;
  } catch (err) {
    console.error(`Model loadSearchResult: ${err}`);
    throw err;
  }
};
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const itemsNumberPerPage = 10;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );

  state.recipe.servings = +newServings;
};
const updateStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  //Add recipe to array of bookmarked recipes
  state.bookmarks.push(recipe);

  //Set variable boomkarked on respective recipe
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
    updateStorage();
  }
};

export const removeBookmark = function (id) {
  //Find index of bookmark in array
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  //Remove bookmark from array
  state.bookmarks.splice(index, 1);
  //Mark current loaded recipe as not bookmarked
  state.recipe.bookmarked = false;
  updateStorage();
};

export const uploadRecipe = async function (data) {
  try {
    const ingredients = Object.entries(data)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      id: 'nečum',
      title: data.title,
      publisher: 'Patrik Prokop',
      source_url: data.sourceUrl,
      image_url: data.image,
      servings: +data.servings,
      cooking_time: +data.cookingTime,
      ingredients,
    };

    const response = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(response);
    addBookmark(state.recipe);
    console.log(response);
  } catch (err) {
    console.error(`💥${err}`);
    throw err;
    // console.error(`${err}💥💥💥`);
  }
};
const loadBookmarksFromStorage = async function () {
  const storage = await JSON.parse(localStorage.getItem('bookmarks'));
  if (!storage) return;
  state.bookmarks = storage;
};

const init = function () {
  loadBookmarksFromStorage();
};

init();
