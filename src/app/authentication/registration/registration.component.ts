import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {User} from '../../shared/models/user.model';
import {Address} from '../../shared/models/address.model';
import {CreditCard} from '../../shared/models/credit-card.model';
import {ActivatedRoute, Router} from '@angular/router';
import {getStates} from '../../shared/utils/address.utils';

@Component({
  selector: 'c-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  redirectUrl: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.route.queryParams.take(1).subscribe(params => this.redirectUrl = params['redirect']);
  }

  registrationCompleted() {
    if (this.redirectUrl) {
      window.location.href = this.redirectUrl;
    } else {
      this.authService.setActive(true);
      this.router.navigate(['/dashboard'])
    }
  }
}
