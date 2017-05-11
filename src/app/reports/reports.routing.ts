import {RouterModule} from '@angular/router';
import {ComingSoonComponent} from '../shared/components/coming-soon/coming-soon.component';

export const reportsRouting = RouterModule.forChild([
  {path : 'order', component : ComingSoonComponent},
  {path : 'transaction', component : ComingSoonComponent},
  {path : 'fulfillment', component : ComingSoonComponent},
  {path : 'affiliate', component : ComingSoonComponent},
  {path : 'retention', component : ComingSoonComponent},
  {path : 'projection', component : ComingSoonComponent}
]);

