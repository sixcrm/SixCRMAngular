import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from './search.component';
import {searchRouting} from './search.routing';
import {ResultItemComponent} from './result-item/result-item.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {Daterangepicker} from 'ng2-daterangepicker';
import {SharedModule} from '../../shared/shared.module';
import {AdvancedSearchComponent} from './advanced-search/advanced-search.component';

@NgModule({
  imports : [
    searchRouting,
    SharedModule,
    PageComponentsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule.forRoot(),
    Daterangepicker
  ],
  declarations : [
    SearchComponent,
    ResultItemComponent,
    AdvancedSearchComponent
  ],
  exports : [
  ],
  providers: [
  ]
})
export class SearchModule {
}
