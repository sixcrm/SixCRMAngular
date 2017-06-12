import {Component, OnInit, QueryList, Input, ViewChildren} from '@angular/core';
import {NavigationService} from '../navigation.service';
import {MenuItem} from '../menu-item';
import {SidenavItemComponent} from './sidenav-item/sidenav-item.component';
import {environment} from '../../../environments/environment';
import {trigger, state, transition, style, animate} from '@angular/animations';

@Component({
  selector : 'app-sidenav',
  templateUrl : './sidenav.component.html',
  styleUrls : ['./sidenav.component.scss'],
  animations : [
    trigger('flyInOut', [
      state('in', style({transform : 'translateX(0)'})),
      transition('void => *', [
        style({transform : 'translateX(-100%)'}),
        animate(300)
      ]),
      transition('* => void', [
        animate(0, style({transform : 'translateX(-100%)'}))
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {
  @ViewChildren(SidenavItemComponent) children: QueryList<SidenavItemComponent>;

  @Input() isHovering: boolean = false;

  menuItems: MenuItem[] = [];
  versionNumber: string = environment.version;
  _this: SidenavComponent = this;

  private showSidenav: boolean = false;
  private _screenWidth: number = NavigationService.largeViewportWidth;
  private _initialLoad: boolean = true; // Used to show slide in effect on page load for sidenav

  constructor(private _navigation: NavigationService) { }

  ngOnInit() {
    this._navigation.showSidenav.subscribe(showSidenav => {
      if(this._initialLoad) {
        this._initialLoad = false;
        window.setTimeout(() => {
          this.showSidenav = showSidenav;
        }, 300);
      } else {
        this.showSidenav = showSidenav;
      }
    });
    this._navigation.menuItems.subscribe(menuItems => {
      this.menuItems = menuItems;
    });
    this._navigation.windowSize.subscribe(width => {
      if(this._screenWidth > NavigationService.largeViewportWidth && width < NavigationService.largeViewportWidth && this.showSidenav) {
        this._navigation.toggleSidenav(false);
      } else if(this._screenWidth < NavigationService.largeViewportWidth && width > NavigationService.largeViewportWidth) {
        this._navigation.toggleSidenav(true);
      }
      this._screenWidth = width;
    });
  }

  toggle(active: boolean, child: SidenavItemComponent) {
    if(this.children) {
      this.children.forEach(childComponent => {
        if(child !== childComponent) {
          childComponent.toggle(false, undefined, true);
        }
      });
    }
  }
}
