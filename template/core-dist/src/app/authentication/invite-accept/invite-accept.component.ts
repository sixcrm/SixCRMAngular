import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {User} from '../../shared/models/user.model';

@Component({
  selector: 'invite-accept',
  templateUrl: './invite-accept.component.html',
  styleUrls: ['./invite-accept.component.scss']
})
export class InviteAcceptComponent implements OnInit {

  token: string;
  param: string;
  email: string;

  loginRequiredScreen: boolean;
  welcomeScreen: boolean;
  infoScreen: boolean;
  completeScreen: boolean;

  user: User;

  firstName: string = '';
  firstNameError: boolean;

  lastName: string = '';
  lastNameError: boolean;

  username: string = '';
  usernameError: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.token = params['t'];
      this.param = params['p'];

      let decParam = atob(this.param);

      if (decParam && decParam.split(':')[0]) {
        this.email = decParam.split(':')[0];
      }

      if (!this.token || !this.param || !this.email) {
        this.router.navigate(['/']);
      } else {
        this.validateLoggedInUser();
      }
    });
  }

  goToLogin(): void {
    this.authService.logout(this.router.url);
  }

  acceptInvite(): void {
    this.authService.activateUser(this.token, this.param).subscribe((user: User) =>{
      if (user) {
        this.user = user;

        if (this.user.name && this.user.name.length >= 2) {
          this.welcomeScreen = false;
          this.infoScreen = false;
          this.completeScreen = true;
        } else {
          this.welcomeScreen = false;
          this.infoScreen = true;
          this.completeScreen = false;
        }
      }
    });
  }

  submitInfo(): void {
    if (this.firstName.length < 2 ) {
      this.firstNameError = true;
    }

    if (this.lastName.length < 2) {
      this.lastNameError = true;
    }

    if (this.username.length < 4) {
      this.usernameError = true;
    }

    if (this.isFirstNameInvalid() || this.isLastNameInvalid() || this.isUsernameInvalid()) {
      return;
    }

    this.user.name = this.username;
    this.user.auth0Id = 'auth0id';
    this.user.active = 'true';

    this.authService.updateUserForAcceptInvite(this.user).subscribe((success) => {
      if (success) {
        this.welcomeScreen = false;
        this.infoScreen = false;
        this.completeScreen = true;
      }
    })
  }

  complete(): void {
    this.authService.refreshSixUser();
  }

  private validateLoggedInUser(): void {
    if (this.authService.authenticated()) {
      let loggedInEmail = this.authService.getUserEmail();

      if (this.email === loggedInEmail) {
        this.welcomeScreen = true;
      } else {
        this.loginRequiredScreen = true;
      }

    } else {
      this.loginRequiredScreen = true;
    }
  }

  private isFirstNameInvalid(): boolean {
    return this.firstNameError && this.firstName.length < 2;
  }

  private isLastNameInvalid(): boolean {
    return this.lastNameError && this.lastName.length < 2;
  }

  private isUsernameInvalid(): boolean {
    return this.usernameError && this.username.length < 4;
  }
}
