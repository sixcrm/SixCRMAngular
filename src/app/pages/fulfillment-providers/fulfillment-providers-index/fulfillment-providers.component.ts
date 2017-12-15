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

    this.entityFactory = () => new FulfillmentProvider({provider: {name: 'Hashtag'}});

    this.columnParams = [
      new ColumnParams('Provider', (e: FulfillmentProvider) => e.provider),
      new ColumnParams('Name', (e: FulfillmentProvider) => e.name),
      new ColumnParams('Username',(e: FulfillmentProvider) => e.username),
      new ColumnParams('Password', (e: FulfillmentProvider) => e.password)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
