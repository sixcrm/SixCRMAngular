import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphqlDocsComponent } from './components/graphql-docs/graphql-docs.component';
import { GraphqlDocsService } from './graphql-docs.service';
import { TypeComponent } from './components/type/type.component';
import { FieldComponent } from './components/field/field.component';
import { ArgumentsComponent } from './components/arguments/arguments.component';
import { InputFieldsComponent } from './components/input-fields/input-fields.component';
import {MaterialModule} from '@angular/material';
import { FilterSearchItemsPipe } from './filter-types.pipe';
import {FormsModule} from '@angular/forms';
import { SideSearchComponent } from './components/side-search/side-search.component';
import {ClipboardModule} from 'ngx-clipboard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ClipboardModule
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
    FilterSearchItemsPipe,
    SideSearchComponent
  ],
  providers: [
    GraphqlDocsService
  ]
})
export class GraphqlDocsModule { }
