import {RouterModule} from '@angular/router';
import {RolesComponent} from './roles-index/roles.component';
import {RoleViewComponent} from './role-view/role-view.component';
import {RolesAclGuard} from '../guards/roles-acl-guard.service';

export const rolesRouting = RouterModule.forChild([
  { path : '', component : RolesComponent, canActivate: [RolesAclGuard] },
  { path : ':id', component : RoleViewComponent, canActivate: [RolesAclGuard], canDeactivate: [RolesAclGuard] },
  { path : 'shared/:id', component : RoleViewComponent, canActivate: [RolesAclGuard], canDeactivate: [RolesAclGuard] }
]);

