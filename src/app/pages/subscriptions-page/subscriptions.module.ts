import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsComponent } from './subscriptions-index/subscriptions.component';
import {subscriptionsRouting} from './subscriptions.routing';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    subscriptionsRouting,
    PageComponentsModule,
    SharedModule
  ],
  declarations: [SubscriptionsComponent]
})
export class SubscriptionsModule { }
