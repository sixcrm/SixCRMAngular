import {RouterModule} from '@angular/router';
import {GraphDocsPageComponent} from './graph-docs-page/graph-docs-page.component';
import {GraphqlDocsComponent} from '../../graph-qldocs/components/graphql-docs/graphql-docs.component';

export const documentationRouting = RouterModule.forChild([
  { path : 'graph', component : GraphDocsPageComponent, children: [
    { path : '', component : GraphqlDocsComponent },
    { path : 'query/:id', component : GraphqlDocsComponent },
    { path : 'mutation/:id', component : GraphqlDocsComponent },
    { path : 'type/:id', component : GraphqlDocsComponent }
  ]}
]);
