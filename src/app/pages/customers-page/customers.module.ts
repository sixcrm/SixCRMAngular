import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {customersRouting } from './customers.routing';
import {CustomersComponent} from './customers-index/customers.component';
import {CustomerViewComponent} from './customer-view/customer-view.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {CustomersAclGuard} from '../guards/customers-acl-guard.service';
import { CustomerTransactionsComponent } from './customer-view/customer-transactions/customer-transactions.component';
import { CustomerSessionsComponent } from './customer-view/customer-sessions/customer-sessions.component';
import {SharedModule} from '../../shared/shared.module';
import { CustomerRebillsComponent } from './customer-view/customer-rebills/customer-rebills.component';
import { CustomerNotesComponent } from './customer-view/customer-notes/customer-notes.component';
import { CustomerEventsComponent } from './customer-view/customer-events/customer-events.component';
import { CreditCardInputComponent } from './customer-view/credit-card-input/credit-card-input.component';
import {TextMaskModule} from 'angular2-text-mask';
import { CustomerFulfillmentComponent } from './customer-view/customer-fulfillment/customer-fulfillment.component';
import { CustomerRebillEditComponent } from './customer-view/customer-rebill-edit/customer-rebill-edit.component';
import {Daterangepicker} from 'ng2-daterangepicker';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { SingleEventComponent } from './customer-view/customer-events/single-event/single-event.component';
import { CustomerAddNewComponent } from './customer-view/customer-add-new/customer-add-new.component';
import {TranslationModule} from '../../translation/translation.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';

@NgModule({
  imports : [
    customersRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    TextMaskModule,
    Daterangepicker,
    InfiniteScrollModule,
    TranslationModule
  ],
  declarations : [
    CustomersComponent,
    CustomerViewComponent,
    CustomerTransactionsComponent,
    CustomerSessionsComponent,
    CustomerRebillsComponent,
    CustomerNotesComponent,
    CustomerEventsComponent,
    CreditCardInputComponent,
    CustomerFulfillmentComponent,
    CustomerRebillEditComponent,
    SingleEventComponent,
    CustomerAddNewComponent
  ],
  exports : [CreditCardInputComponent],
  providers: [
    CustomersAclGuard
  ]
})
export class CustomersModule {
}
