import {element, by, browser} from 'protractor';

export class DashboardPage {

  navigateTo() {
    browser.get('/dashboard');
  }

  getCollapsedMenuButton() {
    return element(by.css('.topnav__items--collapsed__icon'));
  }

  getCollapsedMenuItems() {
    return element.all(by.css('.topnav__items--collapsed__menu__button'));
  }
}
