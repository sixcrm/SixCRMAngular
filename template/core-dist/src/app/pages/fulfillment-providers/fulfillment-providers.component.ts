import { Component, OnInit } from '@angular/core';
import {FulfillmentProvidersService} from "../../shared/services/fulfillment-providers.service";
import {FulfillmentProvider} from '../../shared/models/fulfillment-provider.model';
import {Router, ActivatedRoute} from '@angular/router';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';

@Component({
  selector: 'fulfillment-providers',
  templateUrl: './fulfillment-providers.component.html',
  styleUrls: ['./fulfillment-providers.component.scss']
})
export class FulfillmentProvidersComponent extends AbstractEntityIndexComponent<FulfillmentProvider> implements OnInit {

  constructor(
    private fulfillmentProvidersService: FulfillmentProvidersService,
    router: Router,
    route: ActivatedRoute,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(fulfillmentProvidersService, router, route, dialog, progressBarService, paginationService)
  }

  ngOnInit() {
    this.fulfillmentProvidersService.entityDeleted$.subscribe((data) => this.fulfillmentProvidersService.getEntities());

    this.init();
  }
}
