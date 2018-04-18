import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventHooksComponent} from './event-hook-index/event-hooks.component';
import { EventHookViewComponent } from './event-hook-view/event-hook-view.component';
import { EventHookAddNewComponent } from './event-hook-view/event-hook-add-new/event-hook-add-new.component';
import {eventHooksRouting} from './event-hooks.routing';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {TranslationModule} from '../../translation/translation.module';
import {FormsModule} from '@angular/forms';
import {CodemirrorModule} from 'ng2-codemirror';
import { EventHookCodeComponent } from './event-hook-view/event-hook-code/event-hook-code.component';
import { EventHooksSharedComponent } from './event-hook-index/event-hooks-shared/event-hooks-shared.component';
import { EventHooksCustomComponent } from './event-hook-index/event-hooks-custom/event-hooks-custom.component';
import {SharedHooksListComponent} from './event-hook-view/shared-hooks-list/shared-hooks-list.component';
import {FilterHooksByTypePipe} from './filter-hooks-by-type.pipe';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';

@NgModule({
  imports: [
    CommonModule,
    eventHooksRouting,
    CommonModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    TranslationModule,
    FormsModule,
    CodemirrorModule
  ],
  declarations: [
    EventHooksComponent,
    EventHookViewComponent,
    EventHookAddNewComponent,
    EventHookCodeComponent,
    EventHooksSharedComponent,
    EventHooksCustomComponent,
    SharedHooksListComponent,
    FilterHooksByTypePipe
  ]
})
export class EventHooksModule {
}
