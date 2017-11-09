import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {UsersService} from '../../shared/services/users.service';
import {Acl} from '../../shared/models/acl.model';
import {User} from '../../shared/models/user.model';
import {Router} from '@angular/router';
import {AclsService} from '../../shared/services/acls.service';
import {firstIndexOf} from '../../shared/utils/array.utils';
import {Subscription} from 'rxjs';

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

  constructor(
    private authService: AuthenticationService,
    private userService: UsersService,
    private aclService: AclsService,
    private router: Router
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
      this.fetchUser()
    } else if (this.activeAcl.role.name === 'Owner' && this.activeAcl.termsAndConditionsOutdated) {
      this.fetchOwner();
    }
  }

  fetchUser(): void {
    this.userService.getLatestTermsAndConditions().take(1).subscribe((response) => {
      this.termsAndConditions = response.json().response.data.latesttermsandconditions;
    })
  }

  fetchOwner(): void {
    this.userService.getLatestTermsAndConditions('owner').take(1).subscribe((response) => {
      this.termsAndConditions = response.json().response.data.latesttermsandconditions;
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

    this.userService.updateUserForAcceptTermsAndConditions(this.activeUser).take(1).subscribe(() => {
      this.activeUser.termsAndConditionsOutdated = false;
      this.authService.updateSixUser(this.activeUser);

      if (this.activeAcl.role.name === 'Owner' && this.authService.getActiveAcl().termsAndConditionsOutdated) {
        this.fetchOwner();
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  acceptOwnerTermsAndConditions(): void {
    this.aclService.updateUserAclTermsAndConditions(this.activeAcl, this.termsAndConditions.version).take(1).subscribe(() => {
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

}
