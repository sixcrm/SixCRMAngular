import {Component, ElementRef, OnInit, HostListener} from '@angular/core';
import {NavigationService} from './navigation/navigation.service';
import {TranslationService} from './translation/translation.service';
import {Router, Event, NavigationStart, NavigationEnd} from '@angular/router';
import 'hammerjs';
import 'rxjs/Rx';

@Component({
  selector : 'app-root',
  templateUrl : 'app.component.html',
  styleUrls : ['app.component.sass']
})
export class AppComponent implements OnInit {

  constructor(
    private _navigation: NavigationService,
    private _router: Router,
    private _elementRef: ElementRef,
    private _translationService: TranslationService
  ) { }

  ngOnInit() {
    this._router.events.subscribe((event: Event) => {
      if(event instanceof NavigationStart) {
        if(this._navigation.mediumScreenAndDown) {
          this._navigation.toggleSidenav(false); // Hide nav on initial load if smaller than large screen
        }
      } else if(event instanceof NavigationEnd) {
        this._navigation.setCurrentRoute((<NavigationEnd>event).urlAfterRedirects);
        let routerOutletComponent: HTMLElement = this._elementRef.nativeElement.getElementsByTagName('app-topnav')[0];
        if(routerOutletComponent) {
          routerOutletComponent.scrollIntoView(); // Scroll back to top after route change
        }
      }
    });

    this._translationService.loadTemporaryTranslations();
  }

  @HostListener('window:resize', ['$event'])
  private resize($event) {
    // Need this to trigger change detection for screen size changes!
    this._navigation.updateViewport();
  }
}
