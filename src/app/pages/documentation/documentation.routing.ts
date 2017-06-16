import {RouterModule} from '@angular/router';
import {GraphDocsComponent} from './graph-docs/graph-docs.component';
import {GraphDocsCComponent} from './graph-docs-c/graph-docs-c.component';

export const documentationRouting = RouterModule.forChild([
  { path : 'graph', component : GraphDocsComponent },
  { path : 'graph-c', component : GraphDocsCComponent }
]);
