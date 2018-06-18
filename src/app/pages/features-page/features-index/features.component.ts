import {Component, OnInit, OnDestroy} from '@angular/core';
import {FeatureFlagService} from "../../../authentication/feature-flag.service";
import {AsyncSubject} from "rxjs";
import {FeatureFlag, FeatureFlags} from "../../../shared/models/feature-flags.model";
import {AuthenticationService} from "../../../authentication/authentication.service";

@Component({
  selector: 'features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit, OnDestroy {

  featureFlags: FeatureFlags;
  unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  constructor(
    private featureFlagService: FeatureFlagService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    let flags = this.featureFlagService.localFeatureFlags();

    this.featureFlags = flags;

    this.featureFlagService.featureFlagsUpdated$.takeUntil(this.unsubscribe$).subscribe(() => {
      this.featureFlags = new FeatureFlags(JSON.parse(localStorage.getItem(this.featureFlagService.storageKey())));
    });

    this.featureFlagService.updateLocalFeatureFlags();
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  save() {
    localStorage.setItem(this.featureFlagService.storageKey(), JSON.stringify(this.featureFlags.obj));
    this.featureFlagService.featureFlagsUpdated$.next(this.featureFlagService.localFeatureFlags());
    this.authService.featureFlagsChanged$.next(true);
  }

  fetch() {
    this.featureFlagService.updateLocalFeatureFlags();
    this.featureFlagService.featureFlagsUpdated$.next(this.featureFlagService.featureFlags);
  }

  toggle(flag: FeatureFlag) {
    flag.isDefault = !flag.isDefault;

    this.toObj();
    this.save();
  }

  toObj() {
    let result: any  = {};
    result = JSON.parse(JSON.stringify(this.featureFlags.obj));

    result.features = {};

    for (let flag of this.featureFlags.flags) {
      result.features[flag.id] = {
        name: flag.name,
        description: flag.description,
        default: flag.default,
        features: {}
      };

      if (flag.flags) {

        let subflags = {};

        for (let f of flag.flags) {
          subflags[f.id] = {
            name: f.name,
            description: f.description,
            default: f.default,
            features: {}
          };

          result.features[flag.id].features = subflags;

        }

      }

    }

    this.featureFlags = new FeatureFlags(result);
  }

}
