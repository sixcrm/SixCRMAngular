import { Injectable }     from '@angular/core';
import { CanActivate, Router }    from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
		console.log('authguard can activate called');
    let access = localStorage['access_token'];
		let id = localStorage['id_token']
    let isAuthed = !!access && id;
    if (!isAuthed) this.router.navigate(["/admin/login"]);
    return isAuthed;
  }
}