import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {rolesRouting} from './roles.routing';
import {FormsModule} from '@angular/forms';
import {PageComponentsModule} from '../components/pages-components.module';
import {TranslationModule} from '../../translation/translation.module';
import {SharedModule} from '../../shared/shared.module';
import {RolesComponent} from './roles-index/roles.component';
import {RoleViewComponent} from './role-view/role-view.component';
import { RolesIndexSharedComponent } from './roles-index/roles-index-shared/roles-index-shared.component';
import { RolesIndexCustomComponent } from './roles-index/roles-index-custom/roles-index-custom.component';
import { RoleAclsComponent } from './role-view/role-acls/role-acls.component';
import { RoleAddNewComponent } from './roles-index/role-add-new/role-add-new.component';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';

@NgModule({
  imports: [
    rolesRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    TranslationModule,
    SharedModule
  ],
  declarations: [
    RolesComponent,
    RoleViewComponent,
    RolesIndexSharedComponent,
    RolesIndexCustomComponent,
    RoleAclsComponent,
    RoleAddNewComponent
  ],
  providers: [ ]
})
export class RolesModule { }
