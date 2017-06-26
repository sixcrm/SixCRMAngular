import {Component, OnInit, OnDestroy} from '@angular/core';
import {MerchantProvidersService} from "../../shared/services/merchant-providers.service";
import {MerchantProvider} from '../../shared/models/merchant-provider/merchant-provider.model';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../shared/models/column-params.model';

@Component({
  selector: 'merchant-providers',
  templateUrl: './merchant-providers.component.html',
  styleUrls: ['./merchant-providers.component.scss']
})
export class MerchantProvidersComponent extends AbstractEntityIndexComponent<MerchantProvider> implements OnInit, OnDestroy {

  constructor(
    merchantProvidersService: MerchantProvidersService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(merchantProvidersService, auth, dialog, progressBarService, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('Name', (e: MerchantProvider) => e.name),
      new ColumnParams('Endpoint', (e: MerchantProvider) => e.gateway.endpoint),
      new ColumnParams('Processor name', (e: MerchantProvider) => e.processor.name)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
