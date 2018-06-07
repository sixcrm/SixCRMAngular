import {RouterModule} from '@angular/router';
import {GraphDocsComponent} from './graph-docs/graph-docs.component';
import {GraphDocs2Component} from './graph-docs-2/graph-docs-2.component';

export const documentationRouting = RouterModule.forChild([
  { path : 'graph', component : GraphDocsComponent },
  { path : 'graph2', component : GraphDocs2Component }
]);
