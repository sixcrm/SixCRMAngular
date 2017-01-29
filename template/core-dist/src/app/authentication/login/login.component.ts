import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector : 'c-login',
  templateUrl : 'login.component.html',
  styleUrls : ['login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private _router: Router,
    private auth: AuthenticationService) {
  }

  ngOnInit() {
  }

  login(username, password) {
    this.auth.login(username.value, password.value);
    this._router.navigateByUrl('/examples/dashboard');
  }

  googleLogin(){
    this.auth.loginWithGoogle();
  }

  test(t: any) {
    console.dir(t);
  }

}
