import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {AuthGuard} from './authentication/auth-guard.service';

const appRoutes: Routes = [
  { path : '', loadChildren : './authentication/authentication.module#AuthenticationModule' },
  { path : 'dashboard', loadChildren : './pages/pages.module#PagesModule', canActivate: [AuthGuard] },
  { path : '**', redirectTo : '/dashboard' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
