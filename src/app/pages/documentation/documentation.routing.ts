import {RouterModule} from '@angular/router';
import {GraphDocsComponent} from './graph-docs/graph-docs.component';
import {GraphDocs2Component} from './graph-docs-2/graph-docs-2.component';

export const documentationRouting = RouterModule.forChild([
  { path : 'graph', component : GraphDocsComponent },
  { path : 'graph2', component : GraphDocs2Component },
  { path : 'graph2/query/:id', component : GraphDocs2Component },
  { path : 'graph2/mutation/:id', component : GraphDocs2Component },
  { path : 'graph2/type/:id', component : GraphDocs2Component }
]);
