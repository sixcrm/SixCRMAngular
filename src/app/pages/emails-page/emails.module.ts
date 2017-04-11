import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {EmailsComponent} from './emails.component';
import {EmailComponent} from './email/email.component';
import {EmailsAclGuard} from '../guards/emails-acl-guard.service';

@NgModule({
  imports : [
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
