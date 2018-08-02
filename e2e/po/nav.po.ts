import {browser, element, by} from 'protractor';

export class NavPage {

  get() {
    browser.get('/');
  }

  getNavToggler() {
    return element(by.id('menu-toggler'));
  }

  getNavMenu() {
    return element(by.css('navigation-menu'));
  }

  getItems() {
    return this.getNavMenu().element(by.css('.content')).all(by.css('button'));
  }

  getLink(itemNumber: number) {
    return this.getItems().get(itemNumber);
  }

}
