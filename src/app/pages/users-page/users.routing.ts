import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../../navigation/layouts/default/default.layout.component";
import {UsersComponent} from './users.component';
import {UsersAclGuard} from '../guards/users-acl-guard.service';
import {UserViewComponent} from './user-view/user-view.component';

export const usersRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : UsersComponent, canActivate: [UsersAclGuard] },
      { path : ':id', component : UserViewComponent, canActivate: [UsersAclGuard] },
    ]
  }
]);

