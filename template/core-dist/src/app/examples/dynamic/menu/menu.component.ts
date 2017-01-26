import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../../navigation/navigation.service';
import {MenuItem} from '../../../navigation/menu-item';

@Component({
  selector : 'c-menu',
  templateUrl : './menu.component.html',
  styleUrls : ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  showDynamicMenu: boolean = false;
  dynamicMenuItem: MenuItem = new MenuItem('Dynamic Menu Item', '/examples/dynamic-example');

  constructor(private _navigation: NavigationService) {
  }

  ngOnInit() {
    this._navigation.menuItems.take(1).subscribe(menuItems => {
      this.showDynamicMenu = this._navigation.findMenuItem(this.dynamicMenuItem, menuItems) !== null;
    });
  }

  toggleDynamicMenuItem() {
    if(this.showDynamicMenu) {
      this._navigation.addMenuItem(this.dynamicMenuItem, 0);
    } else {
      this._navigation.removeMenuItem(this.dynamicMenuItem);
    }
  }

}
