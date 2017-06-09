import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {transactionsRouting} from './transactions.routing';
import {MaterialModule} from '@angular/material';
import {TransactionsComponent} from './transactions.component';
import {TransactionViewComponent} from './transaction-view/transaction-view.component';
import {TransactionsAclGuard} from '../guards/transactions-acl-guard.service';
import {TransactionComponent} from './transaction/transaction.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {TextMaskModule} from 'angular2-text-mask';

@NgModule({
  imports : [
    transactionsRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    PageComponentsModule,
    SharedModule,
    TextMaskModule
  ],
  declarations : [
    TransactionsComponent,
    TransactionViewComponent,
    TransactionComponent
  ],
  exports : [
    TransactionComponent
  ],
  providers: [
    TransactionsAclGuard
  ]
})
export class TransactionsModule {
}
