import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Acl} from '../../shared/models/acl.model';

@Component({
  selector: 'payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {

  isOwner: boolean;

  mapAcl = (acl: Acl) => acl.account.name;

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
    this.isOwner = this.authService.getActiveAcl().role.name === 'Owner';
  }

  logout() {
    this.authService.logout();
  }

  changeAcl(acl: Acl) {
    this.authService.changeActiveAcl(acl);
  }
}
