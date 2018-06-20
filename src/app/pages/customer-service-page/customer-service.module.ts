import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {FormsModule} from '@angular/forms';
import {customerServiceRouting} from './customer-service.routing';
import {CustomerServiceDashboardComponent} from './customer-service-dashboard/customer-service-dashboard.component';
import {TranslationModule} from '../../translation/translation.module';
import {SharedModule} from '../../shared/shared.module';
import { CustomerServiceDashboardAutocompleteComponent } from './customer-service-dashboard/customer-service-dashboard-autocomplete/customer-service-dashboard-autocomplete.component';
import {EntityServicesModule} from '../../entity-services/entity-services.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    customerServiceRouting,
    TranslationModule,
    SharedModule,
    EntityServicesModule
  ],
  declarations: [
    CustomerServiceDashboardComponent,
    CustomerServiceDashboardAutocompleteComponent
  ]
})
export class CustomerServiceModule { }
