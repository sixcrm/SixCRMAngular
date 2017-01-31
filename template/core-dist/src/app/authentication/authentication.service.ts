import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { myConfigN } from './auth.config';

declare var Auth0Lock: any;

@Injectable()
export class AuthenticationService {

  private lock = new Auth0Lock(myConfigN.clientID, myConfigN.domain, {});
  private accessToken: string = 'access_token';
  private idToken: string = 'id_token';

  constructor(private router: Router) {
    this.lock.on('authenticated', (authResult: AuthResult) => {
      this.setUser(authResult);
      this.router.navigate(['/dashboard']);
    });
  }

  public authenticated(): boolean {
    return tokenNotExpired();
  }

  public login(): void {
    this.lock.show();
  }

  public logout(): void {
    localStorage.removeItem(this.accessToken);
    localStorage.removeItem(this.idToken);

    this.router.navigate(['/']);
  }

  private setUser(authResult: AuthResult): void {
    localStorage.setItem(this.accessToken, authResult.accessToken);
    localStorage.setItem(this.idToken, authResult.idToken);
  }
}
