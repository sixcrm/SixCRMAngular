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

  ngOnInit(): void {
    setTimeout( () => {
      if (!this.auth.authenticated()) {
        this.auth.showLogin();
      } else {
        this.router.navigate(['/dashboard']);
      }
    }, 200);
  }
}
