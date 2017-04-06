import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {advancedSearchRouting} from './advanced-search.routing';
import {SharedModule} from '../../shared/shared.module';
import {NavigationModule} from '../../navigation/navigation.module';
import {MaterialModule} from '@angular/material';
import {AdvancedSearchComponent} from './advanced-search.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports : [
    advancedSearchRouting,
    SharedModule.forRoot(),
    NavigationModule.forRoot(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule.forRoot()
  ],
  declarations : [
    AdvancedSearchComponent
  ],
  exports : [
  ],
  providers: [
  ]
})
export class AdvancedSearchModule {
}
