import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {ActivatedRoute, Router} from '@angular/router';

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
  ) { }

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
