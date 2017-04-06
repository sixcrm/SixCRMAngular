import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {TablePaginationComponent} from './table-pagination/table-pagination.component';
import {TableActionsComponent} from './table-actions/table-actions.component';
import {EntityViewTopnavComponent} from './entity-view-topnav/entity-view-topnav.component';
import {EntityViewInfoComponent} from './entity-view-info/entity-view-info.component';
import {EntityViewInfoArrayComponent} from './entity-view-info-array/entity-view-info-array.component';

@NgModule({
  imports : [
    CommonModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule
  ],
  declarations : [
    TablePaginationComponent,
    TableActionsComponent,
    EntityViewTopnavComponent,
    EntityViewInfoComponent,
    EntityViewInfoArrayComponent
  ],
  exports : [
    TablePaginationComponent,
    TableActionsComponent,
    EntityViewTopnavComponent,
    EntityViewInfoComponent,
    EntityViewInfoArrayComponent
  ],
  providers: [

  ]
})
export class PageComponentsModule {
}
