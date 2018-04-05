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
import { EntityViewBreadcrumbsComponent } from './entity-view-breadcrumbs/entity-view-breadcrumbs.component';
import {RouterModule} from '@angular/router';
import { EntityViewGalleryComponent } from './entity-view-gallery/entity-view-gallery.component';
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

@NgModule({
  imports : [
    CommonModule,
    RouterModule,
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
    TableDensityComponent,
    EntityViewBreadcrumbsComponent,
    EntityViewGalleryComponent,
    EntityViewTagComponent,
    EntityViewEntityaclComponent,
    SchedulesDetailedComponent,
    ScheduleDetailsComponent,
    ScheduleDetailedHeaderComponent,
    ScheduleDetailedListComponent,
    ScheduleDetailedListViewComponent,
    ScheduleDetailedTimelineComponent,
    ScheduleDetailsHeaderComponent,
    ScheduleDetailsTitleComponent
  ],
  exports : [
    TableActionsComponent,
    EntityViewTopnavComponent,
    EntityViewInfoComponent,
    EntityViewInfoArrayComponent,
    EntitiesTableComponent,
    TableMemoryComponent,
    TablePreferencesComponent,
    TableAdvancedComponent,
    EntityViewBreadcrumbsComponent,
    EntityViewGalleryComponent,
    EntityViewTagComponent,
    EntityViewEntityaclComponent,
    SchedulesDetailedComponent
  ],
  providers: [

  ]
})
export class PageComponentsModule {
}
