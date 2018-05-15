import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import {ActivatedRoute} from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector : 'auth',
  templateUrl : 'auth.component.html',
  styleUrls : ['auth.component.scss']
})
export class AuthComponent implements OnInit {

  showSpinner: boolean = true;
  showGenericSpinner: boolean= environment.branding && environment.branding.showGenericLoader;

  constructor(private auth: AuthenticationService) { }

  ngOnInit(): void {
    setTimeout( () => {
      if (!this.auth.authenticated()) {
        this.auth.showLogin();
        this.showSpinner = false;
      }
    }, 500);
  }
}
