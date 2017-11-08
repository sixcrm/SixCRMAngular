import { Component, OnInit } from '@angular/core';
import {TermsAndConditionsControllerService} from '../../shared/services/terms-and-conditions-controller.service';
import {AuthenticationService} from '../authentication.service';
import {UsersService} from '../../shared/services/users.service';
import {Acl} from '../../shared/models/acl.model';
import {User} from '../../shared/models/user.model';
import {Router} from '@angular/router';

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
export class TermsAndConditionsComponent implements OnInit {

  termsAndConditions: TermsAndConditions = {};
  activeAcl: Acl;
  activeUser: User;

  constructor(
    private authService: AuthenticationService,
    private userService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activeAcl = this.authService.getActiveAcl();
    this.activeUser = this.authService.getSixUser();

    this.userService.getLatestTermsAndConditions().take(1).subscribe((response) => {
      this.termsAndConditions = response.json().response.data.latesttermsandconditions;
    })
  }

  acceptTermsAndConditions(): void {
    let user = this.authService.getSixUser().copy();
    user.termsAndConditions = this.termsAndConditions.version;

    this.userService.updateUserForAcceptTermsAndConditions(user).take(1).subscribe(() => {
      user.termsAndConditionsOutdated = false;
      this.authService.updateSixUser(user);

      this.router.navigate(['/dashboard']);
    });
  }

  logout(): void {
    this.authService.logout();
  }

}
