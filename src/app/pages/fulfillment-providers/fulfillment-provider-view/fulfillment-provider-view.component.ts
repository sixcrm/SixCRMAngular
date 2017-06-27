import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {FulfillmentProvider} from '../../../shared/models/fulfillment-provider.model';
import {FulfillmentProvidersService} from '../../../shared/services/fulfillment-providers.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'fulfillment-provider-view',
  templateUrl: './fulfillment-provider-view.component.html',
  styleUrls: ['./fulfillment-provider-view.component.scss']
})
export class FulfillmentProviderViewComponent extends AbstractEntityViewComponent<FulfillmentProvider> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  formInvalid: boolean;

  constructor(service: FulfillmentProvidersService,
              route: ActivatedRoute,
              progressBarService: ProgressBarService,
              public navigation: NavigationService
  ) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new FulfillmentProvider();
      this.entity.provider = 'HASHTAG';
      this.entityBackup = this.entity.copy();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value): void {
    this.selectedIndex = value;
  }

  cancelEdit(): void {
    this.formInvalid = false;
    this.cancelUpdate();
  }

  saveProvider(value: boolean): void {
    this.formInvalid = !value;
    if (this.formInvalid) return;

    this.saveOrUpdate(this.entity);
  }

}
