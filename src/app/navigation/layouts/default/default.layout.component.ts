import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../../navigation.service';
import {HttpWrapperService} from '../../../shared/services/http-wrapper.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Acl} from '../../../shared/models/acl.model';
import {User} from '../../../shared/models/user.model';

@Component({
  templateUrl : './default.layout.component.html',
  styleUrls : ['./default.layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  subscription: Subscription;

  showWelcomeOverlay: boolean;

  userAclOutdated: boolean;
  ownerAclOutdated: boolean;

  isInvitedUser: boolean;

  constructor(
    public navigation: NavigationService,
    public http: HttpWrapperService,
    public authService: AuthenticationService,
    private route: ActivatedRoute
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

    this.authService.activeAcl$.subscribe((acl: Acl) => {
      if (!acl || !acl.id) return;

      this.ownerAclOutdated = acl.termsAndConditionsOutdated && acl.role.name === 'Owner';
    });

    this.authService.sixUser$.subscribe((user: User) => {
      if (!user || !user.id) return;

      this.userAclOutdated = user.termsAndConditionsOutdated;
    });

  };

}
