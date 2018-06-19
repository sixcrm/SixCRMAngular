import {NgModule} from "@angular/core";
import {featuresRouting} from "./features.routing";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MaterialSelectionModule} from "../../material-selection/material-selection.module";
import {SharedModule} from "../../shared/shared.module";
import {FeaturesComponent} from "./features-index/features.component";
import {FeaturesSideCardComponent} from './features-side-card/features-side-card.component';
import {FeaturesHeaderComponent} from './features-header/features-header.component';

@NgModule({
  imports: [
    featuresRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    SharedModule
  ],
  declarations: [
    FeaturesComponent,
    FeaturesHeaderComponent,
    FeaturesSideCardComponent
  ],
  providers: [ ]
})
export class FeaturesModule { }
