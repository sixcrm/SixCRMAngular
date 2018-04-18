import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphqlDocsComponent } from './components/graphql-docs/graphql-docs.component';
import { GraphqlDocsService } from './graphql-docs.service';
import { TypeComponent } from './components/type/type.component';
import { FieldComponent } from './components/field/field.component';
import { ArgumentsComponent } from './components/arguments/arguments.component';
import { InputFieldsComponent } from './components/input-fields/input-fields.component';
import { FilterSearchItemsPipe } from './filter-types.pipe';
import {FormsModule} from '@angular/forms';
import { SideSearchComponent } from './components/side-search/side-search.component';
import {ClipboardModule} from 'ngx-clipboard';
import {MaterialSelectionModule} from '../material-selection/material-selection.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
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
