import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {transactionsRouting} from './transactions.routing';
import {MaterialModule} from '@angular/material';
import {TransactionsComponent} from './transactions.component';
import {TransactionViewComponent} from './transaction-view/transaction-view.component';
import {TransactionsAclGuard} from '../guards/transactions-acl-guard.service';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {TextMaskModule} from 'angular2-text-mask';

@NgModule({
  imports : [
    transactionsRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule,
    TextMaskModule
  ],
  declarations : [
    TransactionsComponent,
    TransactionViewComponent
  ],
  exports : [ ],
  providers: [
    TransactionsAclGuard
  ]
})
export class TransactionsModule {
}
