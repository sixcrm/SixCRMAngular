import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {UsersService} from '../../shared/services/users.service';
import {Acl} from '../../shared/models/acl.model';
import {User} from '../../shared/models/user.model';
import {Router} from '@angular/router';
import {AclsService} from '../../shared/services/acls.service';
import {firstIndexOf} from '../../shared/utils/array.utils';
import {Subscription} from 'rxjs';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';

interface TermsAndConditions {
  version?: string,
  title?: string,
  body?: string
}

@Component({
  selector: 'terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit, OnDestroy {

  termsAndConditions: TermsAndConditions = {};
  activeAcl: Acl;
  activeUser: User;
  sub: Subscription;
  updateMode: boolean;
  requestInProgress: boolean;

  mapAcl = (acl: Acl) => acl.account.name;

  constructor(
    public authService: AuthenticationService,
    private userService: UsersService,
    private aclService: AclsService,
    private router: Router,
    public http: HttpWrapperService
  ) { }

  ngOnInit() {
    this.sub = this.authService.sixUser$.subscribe(user => {
      if (user && user.id) {
        this.fetch();
      }
    })
  }

  fetch(): void {
    this.activeUser = this.authService.getSixUser().copy();
    this.activeAcl = this.authService.getActiveAcl().copy();

    if (this.activeUser.termsAndConditionsOutdated) {
      this.fetchUser();
    } else if (this.activeAcl.role.name === 'Owner' && this.activeAcl.termsAndConditionsOutdated) {
      this.fetchOwner();
    }
  }

  fetchUser(): void {
    this.userService.getLatestTermsAndConditions().take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      this.termsAndConditions = response.body.response.data.latesttermsandconditions;
    })
  }

  fetchOwner(): void {
    this.userService.getLatestTermsAndConditions('owner').take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      this.termsAndConditions = response.body.response.data.latesttermsandconditions;
    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  acceptTermsAndConditions(): void {
    if (this.activeUser.termsAndConditionsOutdated) {
      this.acceptUserTermsAndConditions();
    } else if (this.activeAcl.termsAndConditionsOutdated) {
      this.acceptOwnerTermsAndConditions();
    }
  }

  acceptUserTermsAndConditions(): void {
    this.activeUser.termsAndConditions = this.termsAndConditions.version;
    this.requestInProgress = true;

    this.userService.updateUserForAcceptTermsAndConditions(this.activeUser).take(1).subscribe(user => {
      this.requestInProgress = false;

      if (user instanceof CustomServerError) {
        return;
      }

      this.activeUser.updatedAtAPI = user.body.response.data.updateuser.updated_at;
      this.activeUser.termsAndConditionsOutdated = false;
      this.authService.updateSixUser(this.activeUser);

      if (this.activeAcl.role.name === 'Owner' && this.authService.getActiveAcl().termsAndConditionsOutdated) {
        this.fetchOwner();
      } else {
        const redirectRoute = this.authService.isActiveAclCustomerService() ? '/customer-service' :'/dashboard';
        this.router.navigate([redirectRoute]);
      }
    });
  }

  acceptOwnerTermsAndConditions(): void {
    this.requestInProgress = true;

    this.aclService.updateUserAclTermsAndConditions(this.activeAcl, this.termsAndConditions.version).take(1).subscribe(data => {
      this.requestInProgress = false;

      if (data instanceof CustomServerError) {
        return;
      }

      let user = this.authService.getSixUser().copy();

      const index = firstIndexOf(user.acls || [], (acl) => acl.id === this.activeAcl.id);

      if (index !== -1) {
        user.acls[index].termsAndConditionsOutdated = false;

        this.authService.updateSixUser(user);
        this.authService.refreshActiveAcl();
      }

      this.router.navigate(['/dashboard']);
    });
  }

  logout(): void {
    this.authService.logout();
  }

  changeAcl(acl: Acl): void {
    this.authService.changeActiveAcl(acl);
  }
}
