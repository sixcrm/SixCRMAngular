import {RouterModule} from '@angular/router';
import {UsersComponent} from './users.component';
import {UsersAclGuard} from '../guards/users-acl-guard.service';
import {UserViewComponent} from './user-view/user-view.component';

export const usersRouting = RouterModule.forChild([
  { path : '', component : UsersComponent, canActivate: [UsersAclGuard] },
  { path : ':id', component : UserViewComponent, canActivate: [UsersAclGuard] }
]);

