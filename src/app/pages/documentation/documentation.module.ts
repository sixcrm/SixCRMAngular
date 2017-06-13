import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { documentationRouting } from './documentation.routing';
import {GraphDocsComponent} from './graph-docs/graph-docs.component';
import {GraphqlDocsModule} from '../../graph-qldocs/graphql-docs.module';
import { GraphDocsCComponent } from './graph-docs-c/graph-docs-c.component';

@NgModule({
  imports: [
    CommonModule,
    documentationRouting,
    GraphqlDocsModule
  ],
  declarations: [GraphDocsComponent, GraphDocsCComponent]
})
export class DocumentationModule { }
