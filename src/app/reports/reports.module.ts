import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {reportsRouting} from './reports.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    reportsRouting
  ],
  declarations: []
})
export class ReportsModule { }
