import {Component, AfterViewInit} from '@angular/core';
import {NavigationService} from '../../navigation/navigation.service';
import 'prismjs/';

@Component({
  selector : 'c-chips',
  templateUrl : './chips.component.html',
  styleUrls : ['./chips.component.scss']
})
export class ChipsComponent implements AfterViewInit {
  private chipsContact = [{
    tag : 'Jane Doe',
    image : '/assets/images/yuna.jpg'
  }, {
    tag : 'John Smith',
    image : '/assets/images/man.jpg'
  }];

  private chipsContactPlaceholder = {
    placeholder : 'Add Contact',
    secondaryPlaceholder : 'Enter a contact'
  };

  private chipsContactSrc = `
export class ChipsExample {
  private chipsContact = [{
    tag : 'Jane Doe',
    image : '/assets/images/yuna.jpg'
  }, {
    tag : 'John Smith',
    image : '/assets/images/man.jpg'
  }];
  
  private chipsContactPlaceholder = {
    placeholder : 'Add Contact',
    secondaryPlaceholder : 'Enter a contact'
  };
}`;

  private chipsInit = [{
    tag : 'Apple',
  }, {
    tag : 'Microsoft',
  }, {
    tag : 'Google'
  }];

  private chipsInitSrc = `
export class ChipsExample {
  private chipsInit = [{
    tag : 'Apple',
  }, {
    tag : 'Microsoft',
  }, {
    tag : 'Google'
  }];
}`;

  private chipsPlaceholder = {
    placeholder : '+Tag',
    secondaryPlaceholder : 'Enter a tag'
  };

  private chipsPlaceholderSrc = `
export class ChipsExample {
  private chipsPlaceholder = {
    placeholder : '+Tag',
    secondaryPlaceholder : 'Enter a tag'
  };
}`;

  constructor(private _navigation: NavigationService) {
    this._navigation.setPageTitle('Chips');
  }

  ngAfterViewInit() {
    Prism.highlightAll(false);
  }

  updateTabs() {
    window.setTimeout(() => {
      Prism.highlightAll(false);
    }, 10);
  }

}
