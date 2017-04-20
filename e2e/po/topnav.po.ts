import {by, element} from 'protractor';

export class TopnavPage {

  getSearchButton() {
    return element(by.css('app-topnav')).all(by.css('button')).get(1);
  }

  getSearchInput() {
    return element(by.css('app-topnav')).all(by.css('input')).first()
  }
}
