import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {NavigationModule} from '../../navigation/navigation.module';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {smtpProvidersRouting} from './smtp-providers.routing';
import {SmtpProvidersComponent} from './smtp-providers.component';
import {SmtpProviderComponent} from './smtp-provider/smtp-provider.component';
import {SmtpProvidersAclGuard} from '../guards/smtp-providers-acl-guard.service';
import {SmtpProviderViewComponent} from './smtp-provider-view/smtp-provider-view.component';

@NgModule({
  imports : [
    smtpProvidersRouting,
    SharedModule.forRoot(),
    NavigationModule.forRoot(),
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    PageComponentsModule
  ],
  declarations : [
    SmtpProvidersComponent,
    SmtpProviderViewComponent,
    SmtpProviderComponent
  ],
  exports : [
    SmtpProviderComponent
  ],
  providers: [
    SmtpProvidersAclGuard
  ]
})
export class SmtpProvidersModule {
}
