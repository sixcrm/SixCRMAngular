import {browser, element, by} from 'protractor';

export class SidenavPage {

  get() {
    browser.get('/');
  }

  getItems() {
    return element.all(by.css('c-sidenav-item'));
  }

  getLink(itemNumber: number) {
    return element.all(by.css('c-sidenav-item')).get(itemNumber).all(by.css('a')).first();
  }

  getChildreonOf(itemNumber: number) {
    return element.all(by.css('c-sidenav-item')).get(itemNumber).all(by.css('nav-children'));
  }

}
