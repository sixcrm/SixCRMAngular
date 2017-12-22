import {Component, OnInit, OnDestroy} from '@angular/core';
import {FulfillmentProvidersService} from "../../../shared/services/fulfillment-providers.service";
import {FulfillmentProvider} from '../../../shared/models/fulfillment-provider.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';

@Component({
  selector: 'fulfillment-providers',
  templateUrl: './fulfillment-providers.component.html',
  styleUrls: ['./fulfillment-providers.component.scss']
})
export class FulfillmentProvidersComponent extends AbstractEntityIndexComponent<FulfillmentProvider> implements OnInit, OnDestroy {

  constructor(
    fulfillmentProvidersService: FulfillmentProvidersService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(fulfillmentProvidersService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new FulfillmentProvider({});

    this.columnParams = [
      new ColumnParams('FULFILLMENT_INDEX_HEADER_NAME', (e: FulfillmentProvider) => e.name),
      new ColumnParams('FULFILLMENT_INDEX_HEADER_PROVIDER', (e: FulfillmentProvider) => e.provider.name),
      new ColumnParams('FULFILLMENT_INDEX_HEADER_USERNAME',(e: FulfillmentProvider) => e.provider.username),
      new ColumnParams('FULFILLMENT_INDEX_HEADER_PASSWORD', (e: FulfillmentProvider) => e.provider.password)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
