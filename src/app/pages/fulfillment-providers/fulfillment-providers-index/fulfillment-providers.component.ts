import {Component, OnInit, OnDestroy} from '@angular/core';
import {FulfillmentProvidersService} from "../../../entity-services/services/fulfillment-providers.service";
import {FulfillmentProvider} from '../../../shared/models/fulfillment-provider.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'fulfillment-providers',
  templateUrl: './fulfillment-providers.component.html',
  styleUrls: ['./fulfillment-providers.component.scss']
})
export class FulfillmentProvidersComponent extends AbstractEntityIndexComponent<FulfillmentProvider> implements OnInit, OnDestroy {

  constructor(
    fulfillmentProvidersService: FulfillmentProvidersService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(fulfillmentProvidersService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new FulfillmentProvider({});

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('FULFILLMENT_INDEX_HEADER_ID', (e: FulfillmentProvider) => e.id).setSelected(false),
      new ColumnParams('FULFILLMENT_INDEX_HEADER_NAME', (e: FulfillmentProvider) => e.name),
      new ColumnParams('FULFILLMENT_INDEX_HEADER_PROVIDER', (e: FulfillmentProvider) => e.provider.name),
      new ColumnParams('FULFILLMENT_INDEX_HEADER_CREATED', (e: FulfillmentProvider) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('FULFILLMENT_INDEX_HEADER_UPDATED', (e: FulfillmentProvider) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
