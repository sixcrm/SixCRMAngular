import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {NavigationService} from '../../navigation.service';
import {HttpWrapperService} from '../../../shared/services/http-wrapper.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MatSidenav} from '@angular/material';
import {PersistentNotificationsQuickComponent} from '../../persistent-notifications-quick/persistent-notifications-quick.component';
import {Subscription, Observable} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Acl} from '../../../shared/models/acl.model';
import {User} from '../../../shared/models/user.model';

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
  subscription: Subscription;

  showWelcomeOverlay: boolean;

  userAclOutdated: boolean;
  ownerAclOutdated: boolean;

  isInvitedUser: boolean;

  removeShadow: boolean;

  constructor(
    public navigation: NavigationService,
    public http: HttpWrapperService,
    public authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isInvitedUser = this.authService.isInvitedUser();

      if (this.isInvitedUser || !!params['w']) {
        this.showWelcomeOverlay = this.authService.shouldShowWelcome();

        setTimeout(() => {
          this.showWelcomeOverlay = false;
          this.authService.setShowWelcome(this.showWelcomeOverlay);
        }, 2000);
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.removeShadow = this.showSidenav && this.router.url.includes('documentation/graph2');
      }
    });

    this.authService.activeAcl$.subscribe((acl: Acl) => {
      if (!acl || !acl.id) return;

      this.ownerAclOutdated = acl.termsAndConditionsOutdated && acl.role.name === 'Owner';
    });

    this.authService.sixUser$.subscribe((user: User) => {
      if (!user || !user.id) return;

      this.userAclOutdated = user.termsAndConditionsOutdated;
    });

    this.navigation.showSidenav.subscribe(showSidenav => {
      if (this.router.url.includes('documentation/graph2')) {
        this.removeShadow = showSidenav;
      } else {
        this.removeShadow = false;
      }
      this.showSidenav = showSidenav;
    });

    this.persistentNotifications.notificationsFiltered$.subscribe(() => {

      // height of md-sidenav-content is 100vh, to avoid double scrollbar, height must be reduced by persistent
      // notifications container height
      setTimeout(() => {
        const elementHeight = this.persistentNotificationsContainer.nativeElement.offsetHeight;

        if (<any>(document.getElementsByClassName('mat-sidenav-container')[0])) {
          (<any>(document.getElementsByClassName('mat-sidenav-container')[0])).style.height =
            `calc(100vh - ${elementHeight}px)`;
        }

        if (<any>(document.getElementsByClassName('side-navigation')[0])) {
          (<any>(document.getElementsByClassName('side-navigation')[0])).style.minHeight =
            `calc(100vh - ${80 + elementHeight}px)`;
        }
      }, 100)
    })
  };

  ngAfterViewInit() {
    this.sidenav.closedStart.filter(() => this.navigation.mediumScreenAndDown).subscribe(() => {
      this.navigation.toggleSidenav(false);
    });
  }

  hover(hovering: boolean): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (!hovering) {
      this.updateHoverState(false);
    } else {
      this.subscription = Observable.of(true).delay(250).subscribe(() => this.updateHoverState(true))
    }
  }

  private updateHoverState(hovering: boolean) {
    this.isHovering = hovering;

    setTimeout(() => {
      this.showOnHover = !!(!this.showSidenav && this.isHovering);
    }, 1)
  }

}
