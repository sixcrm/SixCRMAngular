import {RouterModule} from '@angular/router';
import {CreditCardsComponent} from './credit-cards-index/credit-cards.component';
import {CreditCardViewComponent} from './credit-card-view/credit-card-view.component';
import {CreditCardsAclGuard} from '../guards/creditcards-acl-guard.service';

export const creditCardsRouting = RouterModule.forChild([
  { path : '', component : CreditCardsComponent, canActivate: [CreditCardsAclGuard] },
  { path : ':id', component : CreditCardViewComponent, canActivate: [CreditCardsAclGuard] }
]);

