import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiDocsComponent } from './api-docs/api-docs.component';
import {apiDocsRouting} from './api-docs.routing';

@NgModule({
  imports: [
    CommonModule,
    apiDocsRouting
  ],
  declarations: [ApiDocsComponent]
})
export class ApiDocsModule { }
