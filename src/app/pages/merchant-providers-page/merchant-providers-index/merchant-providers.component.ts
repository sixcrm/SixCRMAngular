import {Component, OnInit, OnDestroy} from '@angular/core';
import {MerchantProvidersService} from "../../../shared/services/merchant-providers.service";
import {MerchantProvider} from '../../../shared/models/merchant-provider/merchant-provider.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';

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
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(merchantProvidersService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new MerchantProvider();

    this.columnParams = [
      new ColumnParams('MERCHANTPROVIDER_INDEX_HEADER_NAME', (e: MerchantProvider) => e.name),
      new ColumnParams('MERCHANTPROVIDER_INDEX_HEADER_PROCESSOR', (e: MerchantProvider) => e.gateway.name),
      new ColumnParams('MERCHANTPROVIDER_INDEX_HEADER_TYPE', (e: MerchantProvider) => e.gateway.getType())
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
