import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {NavigationModule} from '../../navigation/navigation.module';
import {MaterialModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from './search.component';
import {searchRouting} from './search.routing';
import {ResultItemComponent} from './result-item/result-item.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {Daterangepicker} from 'ng2-daterangepicker';

@NgModule({
  imports : [
    searchRouting,
    SharedModule.forRoot(),
    NavigationModule.forRoot(),
    PageComponentsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule.forRoot(),
    Daterangepicker
  ],
  declarations : [
    SearchComponent,
    ResultItemComponent
  ],
  exports : [
  ],
  providers: [
  ]
})
export class SearchModule {
}
