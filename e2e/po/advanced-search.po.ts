import {browser, element, by} from 'protractor';

export class AdvancedSearchPage {
  navigateTo() {
    browser.get('/advanced-search')
  }

  getSearchInputs() {
    return element(by.css('.advanced-search__content__fields')).all(by.css('input'));
  }

  getSearchButton() {
    return element(by.css('.advanced-search__content__fields__button'));
  }
}
