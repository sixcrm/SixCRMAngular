import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'account-management-header',
  templateUrl: './account-management-header.component.html',
  styleUrls: ['./account-management-header.component.scss']
})
export class AccountManagementHeaderComponent implements OnInit {

  @Input() path: string;
  @Input() showApiKey: boolean;

  account: Account;
  idExpanded: boolean;

  constructor(
    public authService: AuthenticationService,
    public navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.account = this.authService.getActiveAcl().account;
  }

  toggleExpanded() {
    this.idExpanded = !this.idExpanded
  }

}
