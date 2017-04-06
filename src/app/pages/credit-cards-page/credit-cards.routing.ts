import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../../navigation/layouts/default/default.layout.component";
import {CreditCardsComponent} from './credit-cards.component';
import {CreditCardsAclGuard} from '../guards/creditcards-acl-guard.service';
import {CreditCardViewComponent} from './credit-card-view/credit-card-view.component';

export const creditCardsRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : CreditCardsComponent, canActivate: [CreditCardsAclGuard] },
      { path : ':id', component : CreditCardViewComponent, canActivate: [CreditCardsAclGuard] },
    ]
  }
]);

