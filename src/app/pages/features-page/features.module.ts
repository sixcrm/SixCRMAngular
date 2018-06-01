import {NgModule} from "@angular/core";
import {featuresRouting} from "./features.routing";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {PageComponentsModule} from "../components/pages-components.module";
import {MaterialSelectionModule} from "../../material-selection/material-selection.module";
import {SharedModule} from "../../shared/shared.module";
import {TranslationModule} from "../../translation/translation.module";
import {FeaturesComponent} from "./roles-index/features.component";

@NgModule({
  imports: [
    featuresRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    TranslationModule,
    SharedModule
  ],
  declarations: [
    FeaturesComponent,
  ],
  providers: [ ]
})
export class FeaturesModule { }
