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

      if (!this.token || !this.param) {
        this.router.navigate(['/']);
      }
    });

    this.welcomeScreen = true;
  }

  acceptInvite(): void {
    this.authService.activateUser(this.token, this.param).subscribe((user: User) =>{
      if (user) {
        this.user = user;

        if (this.user.name) {
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

    if (this.isFirstNameInvalid() || this.isLastNameInvalid() || this.isFirstNameInvalid()) {
      return;
    }

    this.user.name = this.firstName + ' ' + this.lastName;
    this.authService.updateUserForAcceptInvite(this.user).subscribe((success) => {
      if (success) {
        this.welcomeScreen = false;
        this.infoScreen = false;
        this.completeScreen = true;
      }
    })
  }

  complete(): void {
    this.authService.logout();
  }

  isFirstNameInvalid(): boolean {
    return this.firstNameError && this.firstName.length < 2;
  }

  isLastNameInvalid(): boolean {
    return this.lastNameError && this.lastName.length < 2;
  }

  isUsernameInvalid(): boolean {
    return this.usernameError && this.username.length < 4;
  }
}
