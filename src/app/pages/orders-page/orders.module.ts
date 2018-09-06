import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ordersRouting } from './orders.routing';
import { OrdersComponent } from './orders-index/orders.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {RebillsAclGuard} from '../guards/rebills-acl-guard.service';

@NgModule({
  imports: [
    CommonModule,
    ordersRouting,
    PageComponentsModule,
    SharedModule
  ],
  declarations: [OrdersComponent],
  providers: [RebillsAclGuard]
})
export class OrdersModule { }
