import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {AuthGuard} from './authentication/auth-guard.service';
import {ErrorPageComponent} from './error-page/error-page.component';

const appRoutes: Routes = [
  { path : '', loadChildren : './authentication/authentication.module#AuthenticationModule' },
  { path : 'dashboard', loadChildren : './pages/pages.module#PagesModule', canActivate: [AuthGuard] },
  { path : '**', component : ErrorPageComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
