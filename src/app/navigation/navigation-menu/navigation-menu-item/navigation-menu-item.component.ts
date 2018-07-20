import {Component, OnInit, Input} from '@angular/core';
import {NavigationMenuItem} from '../navigation-menu.component';
import {Router} from '@angular/router';
import {NavigationService} from '../../navigation.service';

@Component({
  selector: 'navigation-menu-item',
  templateUrl: './navigation-menu-item.component.html',
  styleUrls: ['./navigation-menu-item.component.scss']
})
export class NavigationMenuItemComponent implements OnInit {

  @Input() item: NavigationMenuItem;
  @Input() level: number = 0;

  constructor(private router: Router, private navigation: NavigationService) { }

  ngOnInit() {
  }

  navigateTo(item) {
    if (!item.url) return;

    this.navigation.toggleNavMenu(false);

    let extras = {};

    if (item.fragment) {
      extras = {fragment: item.fragment};
    }

    this.router.navigate([item.url], extras);
  }

}
