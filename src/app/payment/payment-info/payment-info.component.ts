import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';

@Component({
  selector: 'payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {

  isOwner: boolean;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.isOwner = this.authService.getActiveAcl().role.name === 'Owner';
  }

  logout() {
    this.authService.logout();
  }
}
