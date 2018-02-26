import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {TableActionsComponent} from './table-actions/table-actions.component';
import {EntityViewTopnavComponent} from './entity-view-topnav/entity-view-topnav.component';
import {EntityViewInfoComponent} from './entity-view-info/entity-view-info.component';
import {EntityViewInfoArrayComponent} from './entity-view-info-array/entity-view-info-array.component';
import { EntitiesTableComponent } from './entities-table/entities-table.component';
import {SharedModule} from '../../shared/shared.module';
import { TableMemoryComponent } from './table-memory/table-memory.component';
import {TranslationModule} from '../../translation/translation.module';
import {ClipboardModule} from 'ngx-clipboard';
import { TablePreferencesComponent } from './table-preferences/table-preferences.component';
import { TableAdvancedComponent } from './table-advanced/table-advanced.component';
import { TableAdvancedHeaderComponent } from './table-advanced/table-advanced-header/table-advanced-header.component';
import { TableAdvancedBulkComponent } from './table-advanced/table-advanced-bulk/table-advanced-bulk.component';
import { TableDensityComponent } from './table-density/table-density.component';
import {TextMaskModule} from 'angular2-text-mask';

@NgModule({
  imports : [
    CommonModule,
    MaterialModule.forRoot(),
    SharedModule,
    FormsModule,
    TranslationModule,
    ClipboardModule,
    TextMaskModule
  ],
  declarations : [
    TableActionsComponent,
    EntityViewTopnavComponent,
    EntityViewInfoComponent,
    EntityViewInfoArrayComponent,
    EntitiesTableComponent,
    TableMemoryComponent,
    TablePreferencesComponent,
    TableAdvancedComponent,
    TableAdvancedHeaderComponent,
    TableAdvancedBulkComponent,
    TableDensityComponent
  ],
  exports : [
    TableActionsComponent,
    EntityViewTopnavComponent,
    EntityViewInfoComponent,
    EntityViewInfoArrayComponent,
    EntitiesTableComponent,
    TableMemoryComponent,
    TablePreferencesComponent,
    TableAdvancedComponent
  ],
  providers: [

  ]
})
export class PageComponentsModule {
}
