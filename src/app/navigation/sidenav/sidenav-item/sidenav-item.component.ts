import {Component, AfterViewInit, OnDestroy, Input, ViewChildren, QueryList} from '@angular/core';
import {ActivatedRoute} from '@angular/router/src/router_state';
import {MenuItem} from '../../menu-item';
import {StringUtils} from '../../../shared/utils/string-utils';
import {NavigationService} from '../../navigation.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector : 'c-sidenav-item',
  templateUrl : './sidenav-item.component.html',
  styleUrls : ['./sidenav-item.component.scss'],
})
export class SidenavItemComponent implements AfterViewInit, OnDestroy {
  @ViewChildren(SidenavItemComponent) children: QueryList<SidenavItemComponent>;
  @Input() menuItem: MenuItem;
  @Input() level: number = 1;
  @Input() active: boolean = false;
  @Input() parent: SidenavItemComponent;
  @Input() full: boolean = false;

  private _this: SidenavItemComponent = this;
  private _subscription: Subscription;

  constructor(private _navigation: NavigationService, private _router: Router, private _activatedRoute: ActivatedRoute) {
  }

  ngAfterViewInit() {
    if(!this.hasChildren && this.hasLink) {
      this._subscription = this._navigation.currentRoute.subscribe(currentRoute => { // Open up the current menu item on initial load (i.e. someones refreshes the page or you go directly to an inner page)
        if(StringUtils.cleanLinkString(currentRoute) === this.menuItem.link) {
          if(this.hasQuery) {
            this._activatedRoute.queryParams.take(1).subscribe(params => {
              if(StringUtils.deepCompare(this.menuItem.queryParams, params)) {
                this.toggle(true);
              }
            });
          } else {
            this.toggle(true);
          }
        }
      });
    }
  }

  ngOnDestroy() {
    if(this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  toggleDropdown(active: boolean) {
    this.active = active;
    if(this.children) {
      this.children.forEach(childMenu => {
        childMenu.toggle(false, undefined, true);
      });
    }
    if(this.parent && active) {
      this.parent.toggle(active, this);
    }
  }

  toggle(active: boolean, child?: SidenavItemComponent, noParent: boolean = false): void {
    this.active = active;

    if(this.children) {
      this.children.forEach(childComponent => {
        if(child !== undefined) {
          if(child !== childComponent) {
            childComponent.toggle(false, undefined, true);
          }
        } else {
          childComponent.toggle(active, undefined, true);
        }
      });
    }

    if(this.parent !== undefined && !noParent) {
      this.parent.toggle(active, this);
    }
  }

  clicked(event: MouseEvent) {
    if(this.menuItem.clickHandler !== null) {
      this.menuItem.clickHandler(event, this._navigation, this);
    }
  }

  get height(): number {
    let addedHeight = 0;
    if(this.children) {
      this.children.forEach(childComponent => {
        if(childComponent.active) {
          addedHeight += childComponent.height;
        }
      });
    }
    return (this.menuItem.children.length * 48) + addedHeight;
  }

  get levelClass(): string {
    if(this.level < 4) {
      return `level${this.level}`;
    }
    return 'level5';
  }

  get hasLink(): boolean {
    if(!this.menuItem) {
      return false;
    }
    return !StringUtils.isEmpty(this.menuItem.link);
  }

  get hasChildren(): boolean {
    if(!this.menuItem || this.hasLink) {
      return false;
    }
    return this.menuItem.children.length > 0;
  }

  get hasQuery(): boolean {
    if(!this.menuItem) {
      return false;
    }
    return !this.menuItem.queryParams ? false : Object.getOwnPropertyNames(this.menuItem.queryParams).length !== 0;
  }
}

