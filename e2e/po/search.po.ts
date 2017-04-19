import {browser, element, by} from 'protractor';

export class SearchPage {
  navigateTo() {
    browser.get('/search')
  }

  getFilterValues() {
    return element.all(by.css('.search__sidenav__option__value'));
  }

  getResults() {
    return element.all(by.css('.search__content__results__item'));
  }

  getOneSearchResult() {
    return element(by.css('.search__content__results__item'));
  }

  getTableResults() {
    return element.all(by.css('.search__content__results--table'));
  }

  getOneSearchTableResult() {
    return element(by.css('.search__content__results--table'));
  }

  getCheckboxes() {
    return element.all(by.css('.md-checkbox-layout'));
  }

  getOneCheckbox() {
    return element(by.css('.md-checkbox-layout'));
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
    return element(by.css('.search__content__title__view--toggle'));
  }

  getAdvancedSearchToggle() {
    return element(by.css('.search__sidenav__button--advanced'));
  }
}
