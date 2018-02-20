import {Component, OnInit, OnDestroy} from '@angular/core';
import {MerchantProviderGroupsService} from "../../../shared/services/merchant-provider-groups.service";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {MerchantProviderGroup} from '../../../shared/models/merchant-provider-group.model';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';

@Component({
  selector: 'merchant-provider-groups',
  templateUrl: './merchant-provider-groups.component.html',
  styleUrls: ['./merchant-provider-groups.component.scss']
})
export class MerchantProviderGroupsComponent extends AbstractEntityIndexComponent<MerchantProviderGroup> implements OnInit, OnDestroy {

  constructor(
    merchantProviderGroupsService: MerchantProviderGroupsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(merchantProviderGroupsService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new MerchantProviderGroup();

    this.columnParams = [
      new ColumnParams('LOADBALANCER_INDEX_HEADER_NAME', (e: MerchantProviderGroup) => e.name),
      new ColumnParams('LOADBALANCER_INDEX_HEADER_MERCHANTNUM',(e: MerchantProviderGroup) => e.merchantProviderConfigurations.length.toString(), 'right').setNumberOption(true)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
