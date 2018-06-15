import {NgModule} from "@angular/core";
import {featuresRouting} from "./features.routing";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {PageComponentsModule} from "../components/pages-components.module";
import {MaterialSelectionModule} from "../../material-selection/material-selection.module";
import {SharedModule} from "../../shared/shared.module";
import {TranslationModule} from "../../translation/translation.module";
import {FeaturesComponent} from "./features-index/features.component";
import {EntityServicesModule} from '../../entity-services/entity-services.module';

@NgModule({
  imports: [
    featuresRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    TranslationModule,
    SharedModule,
    EntityServicesModule
  ],
  declarations: [
    FeaturesComponent,
  ],
  providers: [ ]
})
export class FeaturesModule { }
