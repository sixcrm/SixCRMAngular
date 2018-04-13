import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {NavigationService} from '../../navigation.service';
import {HttpWrapperService} from '../../../shared/services/http-wrapper.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MatSidenav} from '@angular/material';
import {PersistentNotificationsQuickComponent} from '../../persistent-notifications-quick/persistent-notifications-quick.component';

@Component({
  templateUrl : './default.layout.component.html',
  styleUrls : ['./default.layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('persistentNotifications') persistentNotifications: PersistentNotificationsQuickComponent;
  @ViewChild('persistentNotificationsContainer') persistentNotificationsContainer: ElementRef;

  showSidenav: boolean;

  isHovering: boolean = false;
  showOnHover: boolean = false;

  constructor(
    public navigation: NavigationService,
    public http: HttpWrapperService,
    public authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.navigation.showSidenav.subscribe(showSidenav => this.showSidenav = showSidenav);

    this.persistentNotifications.notificationsFiltered$.subscribe(() => {

      // height of md-sidenav-content is 100vh, to avoid double scrollbar, height must be reduced by persistent
      // notifications container height
      setTimeout(() => {
        const elementHeight = this.persistentNotificationsContainer.nativeElement.offsetHeight;

        (<any>(document.getElementsByClassName('md-sidenav-content')[0])).style.height =
          `calc(100vh - ${elementHeight}px)`;
      }, 100)

    })
  }

  ngAfterViewInit() {
    this.sidenav.closedStart.filter(() => this.navigation.mediumScreenAndDown).subscribe(() => {
      this.navigation.toggleSidenav(false);
    });
  }

  hover(value: boolean): void {
    this.isHovering = value;

    setTimeout(() => {
      this.showOnHover = !!(!this.showSidenav && this.isHovering);
    }, 50)
  }

}
