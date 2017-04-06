import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../../navigation/layouts/default/default.layout.component";
import {AdvancedSearchComponent} from './advanced-search.component';

export const advancedSearchRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : AdvancedSearchComponent },
      { path : '**', redirectTo: '' }
    ]
  }
]);

