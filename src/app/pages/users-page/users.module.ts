import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {usersRouting} from './users.routing';
import {UsersComponent} from './users-index/users.component';
import {UserViewComponent} from './user-view/user-view.component';
import {UsersAclGuard} from '../guards/users-acl-guard.service';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import { UserAddNewComponent } from './user-view/user-add-new/user-add-new.component';
import {TranslationModule} from '../../translation/translation.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';

@NgModule({
  imports : [
    usersRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    TranslationModule
  ],
  declarations : [
    UsersComponent,
    UserViewComponent,
    UserAddNewComponent
  ],
  exports : [
  ],
  providers: [
    UsersAclGuard
  ]
})
export class UsersModule {
}
