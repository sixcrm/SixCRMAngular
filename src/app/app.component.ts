import {Component, ElementRef, OnInit, HostListener} from '@angular/core';
import {NavigationService} from './navigation/navigation.service';
import {TranslationService} from './translation/translation.service';
import {Router, Event, NavigationStart, NavigationEnd} from '@angular/router';
import 'hammerjs';
import 'rxjs/Rx';
import {ProcessingDialogComponent} from './dialog-modals/processing-dialog/processing-dialog.component';
import {MatDialogRef, MatDialog} from '@angular/material';

@Component({
  selector : 'app-root',
  templateUrl : 'app.component.html',
  styleUrls : ['app.component.sass']
})
export class AppComponent implements OnInit {

  processingDialogRef: MatDialogRef<ProcessingDialogComponent>;

  constructor(
    private _navigation: NavigationService,
    private _router: Router,
    private _elementRef: ElementRef,
    private _translationService: TranslationService,
    private _dialog: MatDialog
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

    this._navigation.showProcessingOrderOverlay.subscribe(show => {
      if (show) {
        if (this.processingDialogRef) {
          this.processingDialogRef.close();
        }

        this.processingDialogRef = this._dialog.open(
          ProcessingDialogComponent,
          {backdropClass: 'backdrop-blue', panelClass: 'panel-transparent', disableClose: true}
        );
      } else  {
        if (this.processingDialogRef) {
          this.processingDialogRef.close();
        }
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  private resize($event) {
    // Need this to trigger change detection for screen size changes!
    this._navigation.updateViewport();
  }
}
