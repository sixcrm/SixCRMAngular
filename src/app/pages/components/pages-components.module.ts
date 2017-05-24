import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {TableActionsComponent} from './table-actions/table-actions.component';
import {EntityViewTopnavComponent} from './entity-view-topnav/entity-view-topnav.component';
import {EntityViewInfoComponent} from './entity-view-info/entity-view-info.component';
import {EntityViewInfoArrayComponent} from './entity-view-info-array/entity-view-info-array.component';
import { EntitiesTableComponent } from './entities-table/entities-table.component';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports : [
    CommonModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ],
  declarations : [
    TableActionsComponent,
    EntityViewTopnavComponent,
    EntityViewInfoComponent,
    EntityViewInfoArrayComponent,
    EntitiesTableComponent
  ],
  exports : [
    TableActionsComponent,
    EntityViewTopnavComponent,
    EntityViewInfoComponent,
    EntityViewInfoArrayComponent,
    EntitiesTableComponent
  ],
  providers: [

  ]
})
export class PageComponentsModule {
}
