import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphqlDocsComponent } from './components/graphql-docs/graphql-docs.component';
import { GraphqlDocsService } from './graphql-docs.service';
import { QueriesComponent } from './components/queries/queries.component';
import {TypesComponent} from './components/types/types.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    GraphqlDocsComponent
  ],
  declarations: [
    GraphqlDocsComponent,
    QueriesComponent,
    TypesComponent
  ],
  providers: [
    GraphqlDocsService
  ]
})
export class GraphqlDocsModule { }
