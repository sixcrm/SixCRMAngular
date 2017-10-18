import {RouterModule} from '@angular/router';
import {AccessKeysComponent} from './access-keys-index/access-keys.component';
import {AccessKeysAclGuard} from '../guards/access-keys-acl-guard.service';
import {AccessKeysViewComponent} from './access-keys-view/access-keys-view.component';

export const accessKeysRouting = RouterModule.forChild([
  { path : '', component : AccessKeysComponent, canActivate: [AccessKeysAclGuard] },
  { path : ':id', component : AccessKeysViewComponent, canActivate: [AccessKeysAclGuard], canDeactivate: [AccessKeysAclGuard] }
]);

