import View from './View';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.pagination');
  _data;
  _errorMessage = `No recipes found for your query💥`;
  _message = '';

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goTo = +btn.dataset.Goto;
      handler(goTo);
    });
  }
  _generateMarkup() {
    const numberOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currentPage = this._data.page;

    if (currentPage === 1 && numberOfPages > 1) {
      //Page 1, and there are other pages
      return `${this._generateMarkupButtonPlus()}`;
    }

    if (numberOfPages > 1 && currentPage === numberOfPages) {
      //Last page
      return `${this._generateMarkupButtonMinus()}`;
    }

    if (currentPage > 1 && currentPage < numberOfPages) {
      //Other page
      return `${this._generateMarkupButtonMinus()}${this._generateMarkupButtonPlus()}`;
    }
    if (currentPage === 1 && numberOfPages === 1) {
      //Page1, and there are no other pages
      return ``;
    }
  }
  _generateMarkupButtonPlus() {
    return `
      <button data--goto="${
        this._data.page + 1
      }"class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
    </button>
      `;
  }
  _generateMarkupButtonMinus() {
    return `
        <button data--goto="${
          this._data.page - 1
        }"class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
        </button>
      `;
  }
}
export default new ResultsView();
