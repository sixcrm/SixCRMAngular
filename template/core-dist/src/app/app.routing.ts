import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

const appRoutes: Routes = [
  {
    path : 'examples', loadChildren : './examples/examples.module#ExamplesModule'
  },
  {
    path : 'admin', loadChildren : './authentication/authentication.module#AuthenticationModule'
  },
  // {
  //   path : 'pages', loadChildren : () => new Promise(resolve => {
  //   (require as any).ensure([], (require: any) => {
  //     resolve(require('./pages/pages.module').PagesModule);
  //   });
  // })
  // },
  {path: '', redirectTo: '/admin/login', pathMatch: 'full'},
  //{path : '', redirectTo : '/examples/dashboard', pathMatch: 'full'},
  {path : '**', redirectTo : '/examples/dashboard'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
