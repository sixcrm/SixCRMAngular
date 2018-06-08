import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphqlDocs2Component } from './components/graphql-docs-2/graphql-docs-2.component';
import { GraphqlDocs2Service } from './graphql-docs-2.service';
import { TypeComponent } from './components/type/type.component';
import { QueryMutationCardComponent } from './components/query-mutation-card/query-mutation-card.component';
import { TypeCardComponent } from './components/type-card/type-card.component';
import { FilterSearchItemsPipe } from './filter-types.pipe';
import {FormsModule} from '@angular/forms';
import { SideSearchComponent } from './components/side-search/side-search.component';
import { SideContainerComponent } from './components/side-container/side-container.component';
import {ClipboardModule} from 'ngx-clipboard';
import {MaterialSelectionModule} from '../material-selection/material-selection.module';
import {FormatGraphQlPipe} from "./pipes/format-graphql.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    ClipboardModule
  ],
  exports: [
    GraphqlDocs2Component
  ],
  declarations: [
    GraphqlDocs2Component,
    TypeComponent,
    QueryMutationCardComponent,
    FilterSearchItemsPipe,
    SideSearchComponent,
    TypeCardComponent,
    SideContainerComponent,
    FormatGraphQlPipe
  ],
  providers: [
    GraphqlDocs2Service
  ]
})
export class GraphqlDocs2Module { }
