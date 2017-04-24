import {Component, OnInit, OnDestroy} from '@angular/core';
import {FulfillmentProvidersService} from "../../shared/services/fulfillment-providers.service";
import {FulfillmentProvider} from '../../shared/models/fulfillment-provider.model';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';

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
    progressBarService: ProgressBarService,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(fulfillmentProvidersService, auth, dialog, progressBarService, paginationService, router, activatedRoute)
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
