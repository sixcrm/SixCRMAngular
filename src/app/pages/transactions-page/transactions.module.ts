import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {transactionsRouting} from './transactions.routing';
import {TransactionsComponent} from './transactions-index/transactions.component';
import {TransactionsAclGuard} from '../guards/transactions-acl-guard.service';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {TextMaskModule} from 'angular2-text-mask';
import {TranslationModule} from '../../translation/translation.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {EntityServicesModule} from '../../entity-services/entity-services.module';

@NgModule({
  imports : [
    transactionsRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    EntityServicesModule,
    TextMaskModule,
    TranslationModule
  ],
  declarations : [
    TransactionsComponent
  ],
  exports : [ ],
  providers: [
    TransactionsAclGuard
  ]
})
export class TransactionsModule {
}
