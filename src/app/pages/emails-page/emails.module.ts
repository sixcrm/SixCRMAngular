import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {NavigationModule} from '../../navigation/navigation.module';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {EmailsComponent} from './emails.component';
import {EmailComponent} from './email/email.component';
import {EmailsAclGuard} from '../guards/emails-acl-guard.service';

@NgModule({
  imports : [
    SharedModule.forRoot(),
    NavigationModule.forRoot(),
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    PageComponentsModule
  ],
  declarations : [
    EmailsComponent,
    EmailComponent
  ],
  providers: [
    EmailsAclGuard
  ]
})
export class ProductsModule {
}
