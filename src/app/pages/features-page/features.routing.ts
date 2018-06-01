import {RouterModule} from '@angular/router';
import {FeaturesComponent} from "./roles-index/features.component";

export const featuresRouting = RouterModule.forChild([
  { path : '', component : FeaturesComponent }
]);

