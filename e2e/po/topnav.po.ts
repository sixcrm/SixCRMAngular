import {by, element} from 'protractor';

export class TopnavPage {

  getSearchButton() {
    return element(by.css('app-topnav')).all(by.css('button')).get(1);
  }

  getSearchInput() {
    return element(by.css('.topnav-search-input')).all(by.css('input')).first()
  }

  getProfileName() {
    return element(by.css('app-topnav')).element(by.css('.profile-dropdown__header__name'));
  }

  getCompanyName() {
    return element(by.css('app-topnav')).element(by.css('.simple-dropdown__header__value'));
  }

  getProfileMenuButton() {
    return element(by.css('.profile-dropdown__header'));
  }

  getUserSettingsMenuOption() {
    return element(by.css('.profile-dropdown__menu__item'));
  }

  getAddButton() {
    return element(by.css('topnav-dropdown'));
  }

  getDropdownOptions() {
    return this.getAddButton().element(by.css('.options')).all(by.css('div'));
  }

}
