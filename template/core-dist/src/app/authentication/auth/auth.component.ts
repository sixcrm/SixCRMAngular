import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from "@angular/router";

@Component({
  selector : 'auth',
  templateUrl : 'auth.component.html',
  styleUrls : ['auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
    setTimeout( () => {
      if (!this.auth.authenticated()) {
        this.auth.login();
      } else {
        this.router.navigate(['/dashboard']);
      }
    }, 200);
  }
}
