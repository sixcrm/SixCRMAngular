import {RouterModule} from '@angular/router';
import {SearchComponent} from './search.component';
import {AdvancedSearchComponent} from './advanced-search/advanced-search.component';

export const searchRouting = RouterModule.forChild([
  { path : 'search', component : SearchComponent },
  { path : 'customer-service-dashboard', component : SearchComponent },
  { path : 'advanced-search', component : AdvancedSearchComponent }
]);

