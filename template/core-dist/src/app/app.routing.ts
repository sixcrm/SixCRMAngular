import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

const appRoutes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path : 'auth', loadChildren : './authentication/authentication.module#AuthenticationModule' },
  { path : 'dashboard', loadChildren : './pages/pages.module#PagesModule' },
  { path : '**', redirectTo : '/dashboard' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
