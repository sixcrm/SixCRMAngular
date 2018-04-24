import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {Subject, BehaviorSubject} from 'rxjs';
import {MenuItem} from './menu-item';
import {menuItems} from './menu-setup';
import {StringUtils} from '../shared/utils/string-utils';
import {AuthenticationService} from '../authentication/authentication.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';

@Injectable()
export class NavigationService {
  public static smallViewportWidth: number = 600;
  public static largeViewportWidth: number = 992;

  public static laptopBreakpoint: number = 1440;
  public static tabletBreakpoint: number = 900;

  private _menuItems: Subject<MenuItem[]> = new BehaviorSubject([]);
  private _currentRoute: Subject<string> = new BehaviorSubject(null);
  private _windowSize: Subject<number> = new BehaviorSubject(NavigationService.largeViewportWidth);
  private _showSidenav: Subject<boolean> = new BehaviorSubject(this.largeScreen);
  private _isRouteLoading: Subject<boolean> = new BehaviorSubject(true);
  private _showNotifications: Subject<boolean> = new BehaviorSubject(false);
  private _showCreateNewOrderModal: Subject<boolean> = new BehaviorSubject(false);
  private _showProcessingOrderOverlay: Subject<boolean> = new BehaviorSubject(false);

  private showSidenavSelectedValue: boolean = this.largeScreen;

  private latestPath: string;

  constructor(public dialog: MatDialog,
              private authService: AuthenticationService,
              private location: Location,
              private router: Router
  ) {
    this.authService.activeAcl$.subscribe(acl => {
      if (!acl || !acl.account.id) return;

      this.setMenuItems(menuItems(authService, acl));
    });

    this.authService.actingAsAccount$.subscribe(() => {
      this.setMenuItems(menuItems(authService, this.authService.getActiveAcl()));
    })
  }

  public goToNotFoundPage(): void {
    this.router.navigate(['not-found'], {skipLocationChange: true});
  }

  public get menuItems(): Subject<MenuItem[]> {
    return this._menuItems;
  }

  public setMenuItems(menuItems: MenuItem[]): void {
    this._menuItems.next(menuItems);
  };

  public get currentRoute(): Subject<string> {
    return this._currentRoute;
  }

  public setCurrentRoute(route: string): void {
    this._currentRoute.next(route);
  }

  public get windowSize(): Subject<number> {
    return this._windowSize;
  }

  public updateViewport(): void {
    this._windowSize.next(NavigationService.viewport().width);
  }

  public get showSidenav(): Subject<boolean> {
    return this._showSidenav;
  }

  public toggleSidenav(showSidenav: boolean): void {
    this.showSidenavSelectedValue = showSidenav;
    this._showSidenav.next(showSidenav);
  }

  public setSidenavAuto(value: boolean): void {
    this.showSidenav.take(1).subscribe(v => {
      if (v === value) return;

      this.showSidenavSelectedValue = v;
      this._showSidenav.next(value);
    })
  }

  public resetSidenavAuto(): void {
    this.toggleSidenav(this.showSidenavSelectedValue);
  }

  public get showNotifications(): Subject<boolean> {
    return this._showNotifications;
  }

  public toggleNotifications(visible: boolean): void {
    this._showNotifications.next(visible);
  }

  public get isRouteLoading(): Subject<boolean> {
    return this._isRouteLoading;
  }

  public setIsRouteLoading(isRouteLoading: boolean): void {
    this._isRouteLoading.next(isRouteLoading);
  }

  public get showCreateNewModal(): Subject<boolean> {
    return this._showCreateNewOrderModal;
  }

  public setShowCreateNewModal(value: boolean): void {
    this._showCreateNewOrderModal.next(value);
  }

  public get showProcessingOrderOverlay(): Subject<boolean> {
    return this._showProcessingOrderOverlay;
  }

  public setShowProcessingOrderOverlay(value: boolean): void {
    this._showProcessingOrderOverlay.next(value);
  }

  public get mediumScreenAndDown(): boolean {
    return window !== undefined ? window.matchMedia(`(max-width: ${NavigationService.largeViewportWidth}px)`).matches : false;
  }

  public get mediumScreenAndUp(): boolean {
    return window !== undefined ? window.matchMedia(`(min-width: ${NavigationService.smallViewportWidth}px)`).matches : false;
  }

  public get smallScreen(): boolean {
    return window !== undefined ? window.matchMedia(`(max-width: ${NavigationService.smallViewportWidth}px)`).matches : false;
  }

  public get mediumScreen(): boolean {
    return window !== undefined ? (!this.smallScreen && !this.largeScreen) : false;
  }

  public get largeScreen(): boolean {
    return window !== undefined ? window.matchMedia(`(min-width: ${NavigationService.largeViewportWidth}px)`).matches : false;
  }

  public isDesktop(): boolean {
    return window !== undefined ? window.matchMedia(`(min-width: ${NavigationService.laptopBreakpoint + 1}px`).matches : false;
  }

  public isLaptop(): boolean {
    return !this.isDesktop() && !this.isTablet();
  }

  public isTablet(): boolean {
    return window !== undefined ? window.matchMedia(`(max-width: ${NavigationService.tabletBreakpoint}px`).matches : false;
  }

  public findMenuItem(link: string | MenuItem, items: MenuItem[]): MenuItem {
    if(typeof link === 'string') {
      link = StringUtils.cleanLinkString(<string>link);
    }
    let menuItem: MenuItem = null;
    for (let i = 0; i < items.length; i++) {
      if(link instanceof MenuItem) {
        if(items[i].link === (<MenuItem>link).link && items[i].title === (<MenuItem>link).title) {
          menuItem = items[i];
          break;
        } else if(items[i].children.length > 0) {
          menuItem = this.findMenuItem(link, items[i].children);
          if(menuItem !== null) {
            break;
          }
        }
      } else {
        if(items[i].link === <string>link) {
          menuItem = items[i];
          break;
        } else if(items[i].children.length > 0) {
          menuItem = this.findMenuItem(link, items[i].children);
          if(menuItem !== null) {
            break;
          }
        }
      }
    }
    return menuItem;
  }

  public back(): void {
    this.latestPath = this.location.path();

    this.location.back();
  }

  public revertLocation(): void {
    this.location.go(this.latestPath || '/');
    this.setIsRouteLoading(false);
  }

  public forward(): void {
    this.location.forward();
  }

  private static viewport(): ViewPort {
    if(!window) {
      return {width : this.smallViewportWidth, height : 500};
    }
    let e: any = window;
    let a: string = 'inner';
    if(!('innerWidth' in window )) {
      a = 'client';
      e = document.documentElement || document.body;
    }
    return {width : e[a + 'Width'], height : e[a + 'Height']};
  }

}

interface ViewPort {
  width: number;
  height: number;
}
