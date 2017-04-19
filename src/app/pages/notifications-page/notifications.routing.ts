import {RouterModule} from '@angular/router';
import {NotificationsComponent} from './notifications.component';

export const notificationsRouting = RouterModule.forChild([
  { path : '', component : NotificationsComponent },
]);

