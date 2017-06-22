import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { creditCardsRouting} from './credit-cards.routing';
import {MaterialModule} from '@angular/material';
import {CreditCardsComponent} from './credit-cards.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {CreditCardViewComponent} from './credit-card-view/credit-card-view.component';
import {CreditCardComponent} from './credit-card/credit-card.component';
import {CreditCardsAclGuard} from '../guards/creditcards-acl-guard.service';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports : [
    creditCardsRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule
  ],
  declarations : [
    CreditCardsComponent,
    CreditCardViewComponent,
    CreditCardComponent
  ],
  exports : [ ],
  providers: [
    CreditCardsAclGuard
  ]
})
export class CreditCardsModule {
}
