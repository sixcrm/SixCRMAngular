import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {generateHeaders, HttpWrapperService} from "../shared/services/http-wrapper.service";
import {featureFlagsQuery} from "../shared/utils/queries/entities/feature-flag.queries";
import {FeatureFlags} from "../shared/models/feature-flags.model";
import {Acl} from "../shared/models/acl.model";
import {AuthenticationService} from "./authentication.service";
import {Subject} from "rxjs/Subject";

@Injectable()
export class FeatureFlagService {

  public featureFlagsUpdated$: Subject<FeatureFlags> = new Subject();
  public featureFlagsStored$: Subject<boolean> = new Subject();
  public featureFlags: FeatureFlags;

  constructor(private http: HttpWrapperService, private authService: AuthenticationService) {
    this.authService.activeAcl$.subscribe(acl => {
      if (!acl.account.id) return;

      this.fetchFeatureFlags(acl);
    });

    this.authService.actingAsAccount$.subscribe(() => {
      this.fetchFeatureFlags(this.authService.getActiveAcl());
    });
  }

  public isEnabled(featureName: string): boolean {
    let flags = this.featureFlags;
    if (this.authService.isActiveOrActingAclMasterAccount()) {
      flags = this.localFeatureFlags();
    }

    if (!flags) return false;

    return flags.isEnabled(featureName);
  }

  private fetchFeatureFlags(acl: Acl): void {
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
      this.storeFlagsInLocalStorage(flags);
    });

    this.fetchFeatureFlags(this.authService.getActiveAcl());
  }

  private storeFlagsInLocalStorage(flags): void {
    localStorage.setItem(this.storageKey(), JSON.stringify(flags));
    this.featureFlagsStored$.next(true);
  }

  public storageKey(): string {
    return `featureFlags:${this.authService.getActiveAcl().account.id}:${this.authService.getSixUser().email}`;
  }

  public localFeatureFlags() {
    let localFlags = localStorage.getItem(this.storageKey());
    if (!localFlags) {
      return this.featureFlags;
    }
    return new FeatureFlags(JSON.parse(localFlags).obj);
  }

}
