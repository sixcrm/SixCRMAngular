import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {usersRouting} from './users.routing';
import {MaterialModule} from '@angular/material';
import {UsersComponent} from './users-index/users.component';
import {UserViewComponent} from './user-view/user-view.component';
import {UsersAclGuard} from '../guards/users-acl-guard.service';
import {UserComponent} from './user/user.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports : [
    usersRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule
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
