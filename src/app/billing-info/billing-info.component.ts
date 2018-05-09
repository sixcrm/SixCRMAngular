import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication/authentication.service';

@Component({
  selector: 'billing-info',
  templateUrl: './billing-info.component.html',
  styleUrls: ['./billing-info.component.scss']
})
export class BillingInfoComponent implements OnInit {

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
  }

}
