import {Component, OnInit, ElementRef} from '@angular/core';
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
  styleUrls: ['./navigation-menu.component.scss'],
  host: {'(document:keydown)':'onKeyDown($event)', '(document:click)': 'onClick($event)'}
})
export class NavigationMenuComponent implements OnInit {

  sections: NavigationMenuSection[] = [];

  constructor(private navigation: NavigationService, private elementRef: ElementRef) {
    this.navigation.menuSections.subscribe(sections => {
      this.sections = sections;
    });
  }

  ngOnInit() {
  }

  closeMenu() {
    this.navigation.toggleNavMenu(false);
  }

  onKeyDown(event) {
    if (event && event.key === 'Escape') {
      this.closeMenu();
    }
  }

  onClick(event) {
    if (event.target.id === 'menu-toggler-icon' || event.target.id === 'menu-toggler') return;

    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }
}
