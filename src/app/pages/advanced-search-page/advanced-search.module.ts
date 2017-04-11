import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {advancedSearchRouting} from './advanced-search.routing';
import {MaterialModule} from '@angular/material';
import {AdvancedSearchComponent} from './advanced-search.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports : [
    advancedSearchRouting,
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
