import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { documentationRouting } from './documentation.routing';
import {GraphDocsPageComponent} from './graph-docs-page/graph-docs-page.component';
import {GraphqlDocsModule} from '../../graph-qldocs/graphql-docs.module';

@NgModule({
  imports: [
    CommonModule,
    documentationRouting,
    GraphqlDocsModule
  ],
  declarations: [
    GraphDocsPageComponent
  ]
})
export class DocumentationModule { }
