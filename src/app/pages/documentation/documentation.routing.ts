import {RouterModule} from '@angular/router';
import {GraphDocsComponent} from './graph-docs/graph-docs.component';

export const documentationRouting = RouterModule.forChild([
  { path : 'graph', component : GraphDocsComponent }
]);
