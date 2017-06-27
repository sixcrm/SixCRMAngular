import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {AccessKeysComponent} from './access-keys-index/access-keys.component';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports : [
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule
  ],
  declarations : [
    AccessKeysComponent
  ]
})
export class AccessKeysModule {
}
