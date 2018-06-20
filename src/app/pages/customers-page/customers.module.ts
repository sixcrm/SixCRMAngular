import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {customersRouting } from './customers.routing';
import {CustomersComponent} from './customers-index/customers.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {CustomersAclGuard} from '../guards/customers-acl-guard.service';
import {SharedModule} from '../../shared/shared.module';
import {TranslationModule} from '../../translation/translation.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {EntityServicesModule} from '../../entity-services/entity-services.module';
import {CustomerAdvancedModule} from '../customer-advanced-page/customer-advanced.module';
import {CreditCardInputComponent} from './credit-card-input/credit-card-input.component';
import {CustomerAddNewComponent} from './customer-add-new/customer-add-new.component';
import {TextMaskModule} from 'angular2-text-mask';

@NgModule({
  imports : [
    customersRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    EntityServicesModule,
    TranslationModule,
    CustomerAdvancedModule,
    TextMaskModule
  ],
  declarations : [
    CustomersComponent,
    CreditCardInputComponent,
    CustomerAddNewComponent
  ],
  exports : [CreditCardInputComponent],
  providers: [CustomersAclGuard]
})
export class CustomersModule {
}
