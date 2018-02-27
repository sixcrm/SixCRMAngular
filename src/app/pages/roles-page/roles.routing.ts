import {RouterModule} from '@angular/router';
import {RolesComponent} from './roles-index/roles.component';
import {RoleViewComponent} from './role-view/role-view.component';

export const rolesRouting = RouterModule.forChild([
  { path : '', component : RolesComponent },
  { path : ':id', component : RoleViewComponent }
]);

