import {RouterModule} from '@angular/router';
import {GraphDocsComponent} from './graph-docs/graph-docs.component';
import {GraphDocsPageComponent} from './graph-docs-page/graph-docs-page.component';
import {GraphqlDocs2Component} from '../../graph-qldocs-2/components/graphql-docs-2/graphql-docs-2.component';

export const documentationRouting = RouterModule.forChild([
  { path : 'graph', component : GraphDocsComponent },
  { path : 'graph2', component : GraphDocsPageComponent, children: [
    { path : '', component : GraphqlDocs2Component },
    { path : 'query/:id', component : GraphqlDocs2Component },
    { path : 'mutation/:id', component : GraphqlDocs2Component },
    { path : 'type/:id', component : GraphqlDocs2Component },
  ]}
]);
