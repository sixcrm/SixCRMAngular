import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector : 'auth',
  templateUrl : 'auth.component.html',
  styleUrls : ['auth.component.scss']
})
export class AuthComponent implements OnInit {

  showSpinner: boolean = true;

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
