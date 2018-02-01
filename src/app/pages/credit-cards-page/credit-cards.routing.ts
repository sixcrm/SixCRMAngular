import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CreditCardsComponent} from './credit-cards-index/credit-cards.component';
import {CreditCardViewComponent} from './credit-card-view/credit-card-view.component';
import {CreditCardsAclGuard} from '../guards/creditcards-acl-guard.service';

const routes: Routes = [
  { path : '', component : CreditCardsComponent, canActivate: [CreditCardsAclGuard] },
  { path : ':id', component : CreditCardViewComponent, canActivate: [CreditCardsAclGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class creditCardsRouting {
}


