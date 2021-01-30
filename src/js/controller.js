import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    //Mark recipe in recipe list as selected

    resultView.update(model.getSearchResultsPage());

    bookmarksView.render(model.state.bookmarks);

    //1) Load the recipe
    await model.loadRecipe(id);

    //2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(`${err}💥💥💥`);
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    //1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2) load Results
    await model.loadSearchResults(query);

    //3)Render recipes
    resultView.render(model.getSearchResultsPage());

    //4 Render pagination view
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  //1)Render recipes
  resultView.render(model.getSearchResultsPage(goToPage));

  //3 Render pagination view
  paginationView.render(model.state.search);
};

const controlServings = function (newServingNumber) {
  //Update the recipe servings
  model.updateServings(newServingNumber);
  //Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (model.state.recipe.bookmarked) {
    model.removeBookmark(model.state.recipe.id);
  } else {
    model.addBookmark(model.state.recipe);
  }

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (data) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    //Upload new recipe data
    await model.uploadRecipe(data);

    //Add to bookmark
    bookmarksView.render(model.state.bookmarks);
    //Render recipe
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //CLose form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Hell');
};
init();
