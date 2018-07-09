import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphqlDocsComponent } from './components/graphql-docs/graphql-docs.component';
import { GraphqlDocsLayoutComponent } from './components/graphql-docs-layout/graphql-docs-layout.component';
import { GraphqlDocsService } from './graphql-docs.service';
import { TypeComponent } from './components/type/type.component';
import { QueryMutationCardComponent } from './components/query-mutation-card/query-mutation-card.component';
import { TypeCardComponent } from './components/type-card/type-card.component';
import { FilterSearchItemsPipe } from './pipes/filter-types.pipe';
import {FormsModule} from '@angular/forms';
import { SideSearchComponent } from './components/side-search/side-search.component';
import { SideContainerComponent } from './components/side-container/side-container.component';
import { GraphqlHeaderComponent } from './components/graphql-header/graphql-header.component';
import {ClipboardModule} from 'ngx-clipboard';
import {MaterialSelectionModule} from '../material-selection/material-selection.module';
import {FormatGraphQlPipe} from "./pipes/format-graphql.pipe";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialSelectionModule,
    ClipboardModule
  ],
  exports: [
    GraphqlDocsComponent,
    GraphqlDocsLayoutComponent
  ],
  declarations: [
    GraphqlDocsComponent,
    TypeComponent,
    QueryMutationCardComponent,
    FilterSearchItemsPipe,
    SideSearchComponent,
    TypeCardComponent,
    SideContainerComponent,
    FormatGraphQlPipe,
    GraphqlHeaderComponent,
    GraphqlDocsLayoutComponent
  ],
  providers: [
    GraphqlDocsService
  ]
})
export class GraphqlDocsModule { }
