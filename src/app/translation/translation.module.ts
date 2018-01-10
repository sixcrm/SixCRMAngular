import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from './translation.pipe';
import {TranslationService} from './translation.service';
import {NumberLocalePipe} from './number-locale.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    TranslationPipe,
    NumberLocalePipe
  ],
  declarations: [TranslationPipe, NumberLocalePipe],
  providers: [TranslationService]
})
export class TranslationModule { }
