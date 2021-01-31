import View from './View';
import icons from 'url:../../img/icons.svg';
import ResultsView from './resultsView';
import previewView from './previewView';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _errorMessage = `No recipes are bookmarked yet`;
  _message = 'Recipe was uploaded succesfully';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _bntOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    this._bntOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}
export default new AddRecipeView();
