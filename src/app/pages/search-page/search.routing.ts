import {RouterModule} from '@angular/router';
import {SearchComponent} from './search.component';

export const searchRouting = RouterModule.forChild([
  { path : 'search', component : SearchComponent }
]);

