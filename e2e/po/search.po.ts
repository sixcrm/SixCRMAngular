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

  getCheckboxes() {
    return element.all(by.css('.md-checkbox-layout'));
  }

  getOneCheckbox() {
    return element(by.css('.md-checkbox-layout'));
  }
}
