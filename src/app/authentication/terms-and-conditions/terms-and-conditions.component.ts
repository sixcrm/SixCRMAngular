import { Component, OnInit } from '@angular/core';
import {TermsAndConditionsControllerService} from '../../shared/services/terms-and-conditions-controller.service';
import {AuthenticationService} from '../authentication.service';
import {UsersService} from '../../shared/services/users.service';

interface TermsAndConditions {
  content?: string,
  version?: string
}

@Component({
  selector: 'terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  termsAndConditions: TermsAndConditions = {};

  constructor(
    private tacService: TermsAndConditionsControllerService,
    private authService: AuthenticationService,
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.userService.getLatestTermsAndConditions().take(1).subscribe((response) => {
      this.termsAndConditions = response.json().response.data.latesttermsandconditions;
    })
  }

  acceptTermsAndConditions(): void {
    let user = this.authService.getSixUser().copy();
    user.termsAndConditions = this.termsAndConditions.version;

    this.userService.updateUserForAcceptTermsAndConditions(user).take(1).subscribe(() => {
      this.tacService.setTermsAndConditionsOutdated(false);
    });
  }

}
