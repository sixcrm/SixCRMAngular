import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { documentationRouting } from './documentation.routing';
import {GraphDocsComponent} from './graph-docs/graph-docs.component';
import {GraphDocsPageComponent} from './graph-docs-page/graph-docs-page.component';
import {GraphqlDocsModule} from '../../graph-qldocs/graphql-docs.module';
import {GraphqlDocs2Module} from '../../graph-qldocs-2/graphql-docs-2.module';

@NgModule({
  imports: [
    CommonModule,
    documentationRouting,
    GraphqlDocsModule,
    GraphqlDocs2Module
  ],
  declarations: [
    GraphDocsComponent,
    GraphDocsPageComponent
  ]
})
export class DocumentationModule { }
