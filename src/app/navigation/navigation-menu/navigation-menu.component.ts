import { Component, OnInit } from '@angular/core';
import {NavigationService} from '../navigation.service';

export interface NavigationMenuSection {
  subsections?: NavigationMenuSection[];
  items?: NavigationMenuItem[];
}

export interface NavigationMenuItem {
  label: string,
  url?: string,
  fragment?: string,
  count?: number,
  countNew?: number,
  children?: NavigationMenuItem[],
  isHeader?: boolean,
  icon?: string,
  image?: string
}

@Component({
  selector: 'navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {

  sections: NavigationMenuSection[] = [];

  constructor(private navigation: NavigationService) {
    this.navigation.menuSections.subscribe(sections => {
      this.sections = sections;
    });
  }

  ngOnInit() {
  }

  closeMenu() {
    this.navigation.toggleNavMenu(false);
  }
}
