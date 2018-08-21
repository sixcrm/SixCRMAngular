import {NgModule} from "@angular/core";
import {featuresRouting} from "./features.routing";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MaterialSelectionModule} from "../../material-selection/material-selection.module";
import {SharedModule} from "../../shared/shared.module";
import {FeaturesComponent} from "./features-index/features.component";
import {FeaturesSideCardComponent} from './features-side-card/features-side-card.component';
import {PageComponentsModule} from "../components/pages-components.module";
import {FeaturesAclGuard} from '../guards/features-acl-guard.service';

@NgModule({
  imports: [
    featuresRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    SharedModule,
    PageComponentsModule
  ],
  declarations: [
    FeaturesComponent,
    FeaturesSideCardComponent
  ],
  providers: [ FeaturesAclGuard ]
})
export class FeaturesModule { }
