import {RouterModule} from '@angular/router';
import {EventHooksComponent} from './event-hook-index/event-hooks.component';
import {EventHookViewComponent} from './event-hook-view/event-hook-view.component';

export const eventHooksRouting = RouterModule.forChild([
  { path : '', component : EventHooksComponent },
  { path : ':id', component : EventHookViewComponent },
  { path : 'shared/:id', component : EventHookViewComponent }
]);

