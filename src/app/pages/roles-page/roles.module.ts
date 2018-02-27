import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {rolesRouting} from './roles.routing';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {TranslationModule} from '../../translation/translation.module';
import {SharedModule} from '../../shared/shared.module';
import {RolesComponent} from './roles-index/roles.component';
import {RoleViewComponent} from './role-view/role-view.component';

@NgModule({
  imports: [
    rolesRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    TranslationModule,
    SharedModule
  ],
  declarations: [
    RolesComponent,
    RoleViewComponent
  ],
  providers: [ ]
})
export class RolesModule { }
