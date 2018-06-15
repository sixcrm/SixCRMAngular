import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {UsersService} from '../../entity-services/services/users.service';
import {Acl} from '../../shared/models/acl.model';
import {User} from '../../shared/models/user.model';
import {AclsService} from '../../entity-services/services/acls.service';
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

  @Input() type: 'user' | 'owner';
  termsAndConditions: TermsAndConditions = {};
  activeAcl: Acl;
  activeUser: User;
  sub: Subscription;
  requestInProgress: boolean;
  showingOwnerTermsAndConditions: boolean;

  mapAcl = (acl: Acl) => acl.account.name;

  constructor(
    public authService: AuthenticationService,
    private userService: UsersService,
    private aclService: AclsService,
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

    if (this.type === 'user') {
      this.fetchUser();
    } else if (this.type === 'owner') {
      this.fetchOwner();
    }
  }

  fetchUser(): void {
    this.userService.getlatestTermsAndConditions().take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      this.showingOwnerTermsAndConditions = false;
      this.termsAndConditions = response.body.response.data.latesttermsandconditions;
    })
  }

  fetchOwner(): void {
    this.userService.getlatestTermsAndConditions(this.authService.getActiveAcl().account.id, 'owner').take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      this.showingOwnerTermsAndConditions = true;
      this.termsAndConditions = response.body.response.data.latesttermsandconditions;
    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  acceptTermsAndConditions(): void {
    if (this.type === 'user') {
      this.acceptUserTermsAndConditions();
    } else if (this.type === 'owner') {
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
        this.showingOwnerTermsAndConditions = false;
        user.acls[index].termsAndConditionsOutdated = false;

        this.authService.updateSixUser(user);
        this.authService.refreshActiveAcl(user.acls[index].id);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  changeAcl(acl: Acl): void {
    this.authService.changeActiveAcl(acl);
  }
}
