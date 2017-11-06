import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {NavigationService} from '../../navigation.service';
import {HttpWrapperService} from '../../../shared/services/http-wrapper.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MdSidenav} from '@angular/material';
import {PersistentNotificationsQuickComponent} from '../../persistent-notifications-quick/persistent-notifications-quick.component';
import {TermsAndConditionsControllerService} from '../../../shared/services/terms-and-conditions-controller.service';

@Component({
  templateUrl : './default.layout.component.html',
  styleUrls : ['./default.layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav') sidenav: MdSidenav;
  @ViewChild('persistentNotifications') persistentNotifications: PersistentNotificationsQuickComponent;
  @ViewChild('persistentNotificationsContainer') persistentNotificationsContainer: ElementRef;

  showSidenav: boolean;

  isHovering: boolean = false;
  showOnHover: boolean = false;

  alertTopOffsetCurrent: number = 0;

  constructor(
    public navigation: NavigationService,
    public http: HttpWrapperService,
    public authService: AuthenticationService,
    public tacService: TermsAndConditionsControllerService
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
    this.sidenav.onCloseStart.filter(() => this.navigation.mediumScreenAndDown).subscribe(() => {
      this.navigation.toggleSidenav(false);
    });

    document.getElementsByClassName('md-sidenav-content')[0].addEventListener('scroll', (event) => {
      const scrollTop = event.srcElement.scrollTop;
      this.alertTopOffsetCurrent = scrollTop < 70 ? 0 : scrollTop - 70;
    })
  }

  hover(value: boolean): void {
    this.isHovering = value;

    setTimeout(() => {
      this.showOnHover = !!(!this.showSidenav && this.isHovering);
    }, 50)
  }

}
