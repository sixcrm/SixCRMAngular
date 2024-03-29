import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import {TableActionsComponent} from './table-actions/table-actions.component';
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
import {RouterModule} from '@angular/router';
import { EntityViewTagComponent } from './entity-view-tag/entity-view-tag.component';
import { EntityViewEntityaclComponent } from './entity-view-entityacl/entity-view-entityacl.component';
import {SchedulesDetailedComponent} from './schedules-detailed/schedules-detailed.component';
import { ScheduleDetailsComponent } from './schedules-detailed/schedule-details/schedule-details.component';
import { ScheduleDetailedHeaderComponent } from './schedules-detailed/schedule-detailed-header/schedule-detailed-header.component';
import { ScheduleDetailedListComponent } from './schedules-detailed/schedule-detailed-list/schedule-detailed-list.component';
import {ScheduleDetailedListViewComponent} from './schedules-detailed/schedule-detailed-list-view/schedule-detailed-list-view.component';
import { ScheduleDetailedTimelineComponent } from './schedules-detailed/schedule-detailed-timeline/schedule-detailed-timeline.component';
import { ScheduleDetailsHeaderComponent } from './schedules-detailed/schedule-details/schedule-details-header/schedule-details-header.component';
import { ScheduleDetailsTitleComponent } from './schedules-detailed/schedule-details/schedule-details-title/schedule-details-title.component';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import { BlueHeaderComponent } from './blue-header/blue-header.component';
import { TableMemoryAdvancedComponent } from './table-memory-advanced/table-memory-advanced.component';
import { TransactionStatusIconComponent } from './transaction-status-icon/transaction-status-icon.component';
import {EntityServicesModule} from '../../entity-services/entity-services.module';
import { ShipmentStatusComponent } from './shipment-status/shipment-status.component';
import {AdvancedEntitiesTableComponent} from './advanced-entities-table/advanced-entities-table.component';
import {EntitiesTableWrapperComponent} from './entities-table-wrapper/entities-table-wrapper.component';
import { ShipmentDetailsComponent } from './shipment-details/shipment-details.component';

@NgModule({
  imports : [
    CommonModule,
    RouterModule,
    MaterialSelectionModule,
    SharedModule,
    EntityServicesModule,
    FormsModule,
    TranslationModule,
    ClipboardModule,
    TextMaskModule
  ],
  declarations : [
    TableActionsComponent,
    EntitiesTableComponent,
    TableMemoryComponent,
    TablePreferencesComponent,
    TableAdvancedComponent,
    TableAdvancedHeaderComponent,
    TableAdvancedBulkComponent,
    TableDensityComponent,
    EntityViewTagComponent,
    EntityViewEntityaclComponent,
    SchedulesDetailedComponent,
    ScheduleDetailsComponent,
    ScheduleDetailedHeaderComponent,
    ScheduleDetailedListComponent,
    ScheduleDetailedListViewComponent,
    ScheduleDetailedTimelineComponent,
    ScheduleDetailsHeaderComponent,
    ScheduleDetailsTitleComponent,
    BlueHeaderComponent,
    TableMemoryAdvancedComponent,
    TransactionStatusIconComponent,
    ShipmentStatusComponent,
    AdvancedEntitiesTableComponent,
    EntitiesTableWrapperComponent,
    ShipmentDetailsComponent
  ],
  exports : [
    TableActionsComponent,
    EntitiesTableComponent,
    TableMemoryComponent,
    TablePreferencesComponent,
    TableAdvancedComponent,
    EntityViewTagComponent,
    EntityViewEntityaclComponent,
    SchedulesDetailedComponent,
    BlueHeaderComponent,
    TableMemoryAdvancedComponent,
    TransactionStatusIconComponent,
    ShipmentStatusComponent,
    AdvancedEntitiesTableComponent,
    EntitiesTableWrapperComponent,
    ShipmentDetailsComponent
  ],
  providers: [

  ]
})
export class PageComponentsModule {
}
