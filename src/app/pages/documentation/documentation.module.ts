import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { documentationRouting } from './documentation.routing';
import {GraphDocsComponent} from './graph-docs/graph-docs.component';
import {GraphqlDocsModule} from '../../graph-qldocs/graphql-docs.module';

@NgModule({
  imports: [
    CommonModule,
    documentationRouting,
    GraphqlDocsModule
  ],
  declarations: [GraphDocsComponent]
})
export class DocumentationModule { }
