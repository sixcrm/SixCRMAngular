import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { environment } from '../../../environments/environment';
import {Router} from '@angular/router';

@Component({
  selector : 'auth',
  templateUrl : 'auth.component.html',
  styleUrls : ['auth.component.scss']
})
export class AuthComponent implements OnInit {

  showSpinner: boolean = true;
  showGenericSpinner: boolean= environment.branding && environment.branding.showGenericLoader;
  timeout: number = 500;

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit(): void {

    if (this.router.url !== '/') {
      this.timeout = 2000;
    }

    setTimeout( () => {
      if (!this.auth.authenticated()) {
        this.auth.showLogin();
        this.showSpinner = false;
      }
    }, this.timeout);
  }
}
