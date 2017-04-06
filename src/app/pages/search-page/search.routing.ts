import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../../navigation/layouts/default/default.layout.component";
import {SearchComponent} from './search.component';

export const searchRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : SearchComponent },
      { path : '**', redirectTo: '' }
    ]
  }
]);

