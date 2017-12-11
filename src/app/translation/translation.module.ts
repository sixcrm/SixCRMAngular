import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from './translation.pipe';
import {TranslationService} from './translation.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    TranslationPipe
  ],
  declarations: [TranslationPipe],
  providers: [TranslationService]
})
export class TranslationModule { }
