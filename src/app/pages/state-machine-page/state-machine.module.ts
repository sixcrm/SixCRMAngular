import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateMachineDashboardComponent } from './state-machine-dashboard/state-machine-dashboard.component';
import {stateMachineRouting} from "./state-machine.routing";
import {StateMachineAclGuard} from "../guards/state-machine-acl-guard.service";
import {SharedModule} from "../../shared/shared.module";
import {Daterangepicker} from "ng2-daterangepicker";
import { StateMachineSchemaComponent } from './state-machine-dashboard/state-machine-schema/state-machine-schema.component';
import { ArrowComponent } from './state-machine-dashboard/arrow/arrow.component';
import { DottedLineComponent } from './state-machine-dashboard/dotted-line/dotted-line.component';
import { AngleArrowComponent } from './state-machine-dashboard/angle-arrow/angle-arrow.component';
import { StateMachineStatusComponent } from './state-machine-dashboard/state-machine-status/state-machine-status.component';
import { StateMachineStatusItemComponent } from './state-machine-dashboard/state-machine-status/state-machine-status-item/state-machine-status-item.component';
import { StateMachineDetailsComponent } from './state-machine-dashboard/state-machine-details/state-machine-details.component';
import { StateMachineLiveComponent } from './state-machine-live/state-machine-live.component';
import {StateMachineService} from './state-machine.service';
import {ChartsModule} from '../../charts/charts.module';
import {PageComponentsModule} from '../components/pages-components.module';
import { StateMachineRebillComponent } from './state-machine-live/state-machine-rebill/state-machine-rebill.component';
import {FormsModule} from '@angular/forms';
import {StateMachineRebillsComponent} from './state-machine-live/state-machine-rebills/state-machine-rebills.component';
import {TranslationModule} from '../../translation/translation.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {EntityServicesModule} from '../../entity-services/entity-services.module';

@NgModule({
  imports: [
    CommonModule,
    stateMachineRouting,
    SharedModule,
    EntityServicesModule,
    MaterialSelectionModule,
    Daterangepicker,
    ChartsModule,
    PageComponentsModule,
    FormsModule,
    TranslationModule
  ],
  declarations: [
    StateMachineDashboardComponent,
    StateMachineSchemaComponent,
    ArrowComponent, DottedLineComponent,
    AngleArrowComponent, StateMachineStatusComponent,
    StateMachineStatusItemComponent,
    StateMachineDetailsComponent,
    StateMachineLiveComponent,
    StateMachineRebillComponent,
    StateMachineRebillsComponent
  ],
  providers: [StateMachineAclGuard, StateMachineService]
})
export class StateMachineModule { }
