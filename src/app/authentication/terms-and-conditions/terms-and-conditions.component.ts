import { Component, OnInit } from '@angular/core';
import {TermsAndConditionsControllerService} from '../../shared/services/terms-and-conditions-controller.service';
import {AuthenticationService} from '../authentication.service';
import {UsersService} from '../../shared/services/users.service';

@Component({
  selector: 'terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  termsAndConditionsText: string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

  constructor(
    private tacService: TermsAndConditionsControllerService,
    private authService: AuthenticationService,
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.userService.getLatestTermsAndConditions().take(1).subscribe((response) => {
      this.termsAndConditionsText = response.json().latesttermsandconditions.text;
    })
  }

  acceptTermsAndConditions(): void {
    this.userService.updateUserForAcceptTermsAndConditions(this.authService.getSixUser()).take(1).subscribe(() => {
      this.tacService.setTermsAndConditionsOutdated(false);
    });
  }

}
