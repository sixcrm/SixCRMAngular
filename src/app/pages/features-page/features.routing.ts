import {RouterModule} from '@angular/router';
import {FeaturesComponent} from './features-index/features.component';

export const featuresRouting = RouterModule.forChild([
  { path : '', component : FeaturesComponent }
]);

