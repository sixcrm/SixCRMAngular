import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphqlDocsComponent } from './components/graphql-docs/graphql-docs.component';
import { GraphqlDocsService } from './graphql-docs.service';
import { TypeComponent } from './components/type/type.component';
import { FieldComponent } from './components/field/field.component';
import { ArgumentsComponent } from './components/arguments/arguments.component';
import { InputFieldsComponent } from './components/input-fields/input-fields.component';
import {MaterialModule} from '@angular/material';
import { FilterTypesPipe } from './filter-types.pipe';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  exports: [
    GraphqlDocsComponent
  ],
  declarations: [
    GraphqlDocsComponent,
    TypeComponent,
    FieldComponent,
    ArgumentsComponent,
    InputFieldsComponent,
    FilterTypesPipe
  ],
  providers: [
    GraphqlDocsService
  ]
})
export class GraphqlDocsModule { }
