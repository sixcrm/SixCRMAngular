import {element, by} from 'protractor';

export class AppPage {

  getProgressBar() {
    return element(by.css('.progress-bar'));
  }

}
