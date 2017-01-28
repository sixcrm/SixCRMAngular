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
    private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
  }

  login() {
    this._router.navigateByUrl('/examples/dashboard');
  }

  test(t: any) {
    console.dir(t);
  }

}
