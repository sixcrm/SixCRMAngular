import {Component, OnInit, OnDestroy} from '@angular/core';
import {AclsService} from '../../../shared/services/acls.service';
import {FeatureFlagService} from "../../../authentication/feature-flag.service";
import {AsyncSubject} from "rxjs/AsyncSubject";

@Component({
  selector: 'features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit, OnDestroy {

  featureFlags: string;
  unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  constructor(
    public aclService: AclsService,
    private featureFlagService: FeatureFlagService
  ) {}

  ngOnInit() {
    let flags = this.featureFlagService.localFeatureFlags();
    this.featureFlags = JSON.stringify(flags, null, 4);

    this.featureFlagService.featureFlagsStored$.takeUntil(this.unsubscribe$).subscribe(() => {
      this.featureFlags = JSON.stringify(JSON.parse(localStorage.getItem(this.featureFlagService.storageKey())), null, 4);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  save() {
    localStorage.setItem(this.featureFlagService.storageKey(), this.featureFlags);
    this.featureFlagService.featureFlagsUpdated$.next(this.featureFlagService.localFeatureFlags());
  }

  fetch() {
    this.featureFlagService.updateLocalFeatureFlags();
    this.featureFlagService.featureFlagsUpdated$.next(this.featureFlagService.featureFlags);
  }

}
