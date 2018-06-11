import {NgModule, ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from './translation.pipe';
import {TranslationService} from './translation.service';
import {NumberLocalePipe} from './number-locale.pipe';
import { DefaultTranslationService } from './default-translation.service';
import {FeatureFlagService} from "../authentication/feature-flag.service";
import {FeatureFlags} from "../shared/models/feature-flags.model";

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    TranslationPipe,
    NumberLocalePipe
  ],
  declarations: [
    TranslationPipe,
    NumberLocalePipe
  ],
  providers : [
    DefaultTranslationService,
    FeatureFlagService
  ]
})
export class TranslationModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TranslationModule,
      providers: [ TranslationService ]
    }
  }
}
