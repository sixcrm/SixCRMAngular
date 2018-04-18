import {element, by} from 'protractor';

export class MaterialItems {

  getMenuButton(num: number) {
    return element(by.css('.mat-menu-content')).all(by.css('button')).get(num);
  }

  getConfirmDeleteButton() {
    return element(by.css('.custom-dialog__buttons')).all(by.css('div')).last();
  }

}
