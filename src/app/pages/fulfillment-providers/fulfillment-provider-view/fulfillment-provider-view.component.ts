import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {FulfillmentProvider} from '../../../shared/models/fulfillment-provider.model';
import {FulfillmentProvidersService} from '../../../shared/services/fulfillment-providers.service';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'fulfillment-provider-view',
  templateUrl: './fulfillment-provider-view.component.html',
  styleUrls: ['./fulfillment-provider-view.component.scss']
})
export class FulfillmentProviderViewComponent extends AbstractEntityViewComponent<FulfillmentProvider> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  constructor(service: FulfillmentProvidersService,
              route: ActivatedRoute,
              public navigation: NavigationService
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value): void {
    this.selectedIndex = value;
  }

}
