import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { creditCardsRouting} from './credit-cards.routing';
import {PageComponentsModule} from '../components/pages-components.module';
import {CreditCardViewComponent} from './credit-card-view/credit-card-view.component';
import {CreditCardsAclGuard} from '../guards/creditcards-acl-guard.service';
import {SharedModule} from '../../shared/shared.module';
import {CreditCardsComponent} from './credit-cards-index/credit-cards.component';
import {TranslationModule} from '../../translation/translation.module';
import {CustomersModule} from '../customers-page/customers.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {EntityServicesModule} from '../../entity-services/entity-services.module';

@NgModule({
  imports : [
    creditCardsRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    EntityServicesModule,
    TranslationModule,
    CustomersModule
  ],
  declarations : [
    CreditCardsComponent,
    CreditCardViewComponent
  ],
  exports : [ ],
  providers: [
    CreditCardsAclGuard
  ]
})
export class CreditCardsModule {
}
