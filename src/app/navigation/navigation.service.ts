import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {Subject, BehaviorSubject} from 'rxjs';
import {menuItems} from './menu-setup';
import {AuthenticationService} from '../authentication/authentication.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {FeatureFlagService} from "../shared/services/feature-flag.service";
import {NavigationMenuItem, NavigationMenuSection} from './navigation-menu/navigation-menu.component';

@Injectable()
export class NavigationService {
  public static smallViewportWidth: number = 600;
  public static largeViewportWidth: number = 992;

  public static laptopBreakpoint: number = 1440;
  public static tabletBreakpoint: number = 900;

  private _menuSections: Subject<NavigationMenuSection[]> = new BehaviorSubject([]);
  private _windowSize: Subject<number> = new BehaviorSubject(NavigationService.largeViewportWidth);
  private _showNavMenu: Subject<boolean> = new BehaviorSubject(false);
  private _showNotifications: Subject<boolean> = new BehaviorSubject(false);
  private _showCreateNewOrderModal: Subject<boolean> = new BehaviorSubject(false);
  private _showProcessingOrderOverlay: Subject<boolean> = new BehaviorSubject(false);

  private latestPath: string;

  constructor(public dialog: MatDialog,
              private authService: AuthenticationService,
              private location: Location,
              private router: Router,
              public featureFlagService: FeatureFlagService
  ) {
    this.authService.activeAcl$.subscribe(acl => {
      if (!acl || !acl.account.id) return;

      this.setMenuSections(menuItems(authService, acl, featureFlagService));
    });

    this.authService.actingAsAccount$.subscribe(() => {
      this.setMenuSections(menuItems(authService, this.authService.getActiveAcl(), featureFlagService));
    });

    this.featureFlagService.featureFlagsUpdated$.subscribe(() => {
      this.setMenuSections(menuItems(authService, this.authService.getActiveAcl(), featureFlagService));
    });
  }

  public goToNotFoundPage(): void {
    this.router.navigate(['not-found'], {skipLocationChange: true});
  }

  public get menuSections(): Subject<NavigationMenuSection[]> {
    return this._menuSections;
  }

  public setMenuSections(menuSections: NavigationMenuSection[]): void {
    this._menuSections.next(menuSections);
  };

  public get windowSize(): Subject<number> {
    return this._windowSize;
  }

  public updateViewport(): void {
    this._windowSize.next(NavigationService.viewport().width);
  }

  public get showNavMenu(): Subject<boolean> {
    return this._showNavMenu;
  }

  public toggleNavMenu(sowNavMenu: boolean): void {
    this._showNavMenu.next(sowNavMenu);
  }

  public get showNotifications(): Subject<boolean> {
    return this._showNotifications;
  }

  public toggleNotifications(visible: boolean): void {
    this._showNotifications.next(visible);
  }

  public get showCreateNewOrderModal(): Subject<boolean> {
    return this._showCreateNewOrderModal;
  }

  public setShowCreateNewOrderModal(value: boolean): void {
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

  public back(): void {
    this.latestPath = this.location.path();

    this.location.back();
  }

  public revertLocation(): void {
    this.location.go(this.latestPath || '/');
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
