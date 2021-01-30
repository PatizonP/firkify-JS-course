import View from './View';
import icons from 'url:../../img/icons.svg';
import ResultsView from './resultsView';
import previewView from './previewView';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks');
  _data;
  _errorMessage = `No recipes are bookmarked yet`;
  _message = '';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new BookmarksView();
