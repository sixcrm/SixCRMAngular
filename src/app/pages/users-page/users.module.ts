import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {usersRouting} from './users.routing';
import {MaterialModule} from '@angular/material';
import {UsersComponent} from './users.component';
import {UserViewComponent} from './user-view/user-view.component';
import {UsersAclGuard} from '../guards/users-acl-guard.service';
import {UserComponent} from './user/user.component';
import {PageComponentsModule} from '../components/pages-components.module';

@NgModule({
  imports : [
    usersRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    PageComponentsModule
  ],
  declarations : [
    UsersComponent,
    UserViewComponent,
    UserComponent
  ],
  exports : [
    UserComponent
  ],
  providers: [
    UsersAclGuard
  ]
})
export class UsersModule {
}
