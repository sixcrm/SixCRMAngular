import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { documentationRouting } from './documentation.routing';
import {GraphDocsComponent} from './graph-docs/graph-docs.component';

@NgModule({
  imports: [
    CommonModule,
    documentationRouting
  ],
  declarations: [GraphDocsComponent]
})
export class DocumentationModule { }
