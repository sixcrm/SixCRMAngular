import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {generateHeaders, HttpWrapperService} from "./http-wrapper.service";
import {featureFlagsQuery} from "../utils/queries/entities/feature-flag.queries";
import {FeatureFlags} from "../models/feature-flags.model";
import {Acl} from "../models/acl.model";
import {AuthenticationService} from "../../authentication/authentication.service";
import {Subject} from "rxjs";

@Injectable()
export class FeatureFlagService {

  public featureFlagsUpdated$: Subject<FeatureFlags> = new Subject();
  public featureFlagsStored$: Subject<boolean> = new Subject();
  public featureFlags: FeatureFlags;

  private ignoreFeaturesFlag: boolean = !environment.useFeatureFlags;

  constructor(private http: HttpWrapperService, private authService: AuthenticationService) {
    this.authService.activeAcl$.subscribe(acl => {
      if (!acl.account.id) return;

      this.fetchFeatureFlags(acl);
    });

    this.authService.actingAsAccount$.subscribe(account => {
      if (!account || !account.id) return;

      this.fetchFeatureFlags(this.authService.getActiveAcl());
    });
  }

  public isEnabled(featureName: string): boolean {
    if (this.ignoreFeaturesFlag) return true;

    let flags = this.featureFlags;
    if (this.authService.isActiveOrActingAclMasterAccount()) {
      flags = this.localFeatureFlags();
    }

    if (!flags) return false;

    return flags.isEnabled(featureName);
  }

  private fetchFeatureFlags(acl: Acl): void {
    if (this.ignoreFeaturesFlag) return;

    this.http.post(
      environment.endpoint + acl.account.id,
      featureFlagsQuery(environment.name),
      { headers: generateHeaders(this.authService.getToken())}
    )
    .map(data => new FeatureFlags(data.body.response.data.featureflag.configuration))
    .subscribe((flags) => {
      this.featureFlags = flags;
      this.featureFlagsUpdated$.next(flags);
    });
  }

  public updateLocalFeatureFlags() {
    this.featureFlagsUpdated$.take(1).subscribe((flags) => {
      this.storeFlagsInLocalStorage(flags.obj);
    });

    this.fetchFeatureFlags(this.authService.getActiveAcl());
  }

  private storeFlagsInLocalStorage(flags): void {
    if (!flags) return;

    localStorage.setItem(this.storageKey(), JSON.stringify(flags));
    this.featureFlagsStored$.next(true);
  }

  public storageKey(): string {
    return `featureFlags:${this.authService.getActiveAcl().account.id}`;
  }

  public localFeatureFlags() {
    let localFlags = localStorage.getItem(this.storageKey());
    if (!localFlags) {
      return this.featureFlags;
    }

    try {
      return new FeatureFlags(JSON.parse(localFlags));
    } catch (error) {
      return new FeatureFlags({});
    }
  }

}
