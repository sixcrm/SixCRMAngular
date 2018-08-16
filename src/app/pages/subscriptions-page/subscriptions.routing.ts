import {RouterModule} from '@angular/router';
import {SubscriptionsComponent} from './subscriptions-index/subscriptions.component';

export const subscriptionsRouting = RouterModule.forChild([
  { path : '', component : SubscriptionsComponent, canActivate: [] },
]);

