import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {DefaultLayoutComponent} from "./navigation/layouts/default/default.layout.component";

const appRoutes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path : 'auth', loadChildren : './authentication/authentication.module#AuthenticationModule' },
  { path : 'dashboard', component : DefaultLayoutComponent },
  { path : '**', redirectTo : '/dashboard' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
