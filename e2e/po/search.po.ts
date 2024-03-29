import {browser, element, by} from 'protractor';

export class SearchPage {
  navigateTo() {
    browser.get('/search')
  }

  getSpinner() {
    return element(by.css('.search__content__results__cards__spinner'));
  }

  getFilterValues() {
    return element.all(by.css('.search__sidenav__item__name'));
  }

  getFilterValueButtons() {
    return element(by.css('.search__sidenav__options')).all(by.css('mat-icon'));
  }

  getResults() {
    return element.all(by.css('.entity-list__item'));
  }

  getOneSearchResult() {
    return element(by.css('.search__content__results__cards')).element(by.css('.entity-list__item'));
  }

  getPerfectMatch() {
    return element(by.css('perfect-match'));
  }

  getTableResults() {
    return element.all(by.css('.search__content__results--table'));
  }

  getOneSearchTableResult() {
    return element(by.css('.search__content__results--table'));
  }

  getCheckboxes() {
    return element.all(by.css('.mat-checkbox-layout'));
  }

  getOneCheckbox() {
    return element(by.css('.mat-checkbox-layout'));
  }

  getQuickSearchInput() {
    return element(by.css('.search__sidenav__query__container')).element(by.css('input'));
  }

  getQuickSearchButton() {
    return element(by.css('.search__sidenav__query__icon'));
  }

  getSuggestions() {
    return element(by.css('autocomplete'));
  }

  getViewModeToggle() {
    return element(by.css('.search__content__title__options')).all(by.css('mat-icon')).last();
  }
}
