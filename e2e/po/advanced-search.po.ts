import {browser, element, by} from 'protractor';

export class AdvancedSearchPage {
  navigateTo() {
    browser.get('/advanced-search')
  }

  getComponent() {
    return element(by.css('advanced-search'));
  }

  getHiddenAdvancedSearch() {
    return element(by.css('.advanced-search--inactive'));

  }

  getSearchInputs() {
    return element(by.css('.advanced-search__content__fields')).all(by.css('input'));
  }

  getSearchButton() {
    return element(by.css('.advanced-search__content__fields__button'));
  }
}
