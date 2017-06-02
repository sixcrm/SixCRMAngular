import {RouterModule} from '@angular/router';
import {ApiDocsComponent} from './api-docs/api-docs.component';

export const apiDocsRouting = RouterModule.forChild([
  { path : '', component : ApiDocsComponent }
]);

