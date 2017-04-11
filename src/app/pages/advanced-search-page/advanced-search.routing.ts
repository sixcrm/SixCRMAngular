import {RouterModule} from '@angular/router';
import {AdvancedSearchComponent} from './advanced-search.component';

export const advancedSearchRouting = RouterModule.forChild([
  { path : '', component : AdvancedSearchComponent },
  { path : '**', redirectTo: '' }
]);

