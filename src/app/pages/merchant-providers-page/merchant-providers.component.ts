import { Component, OnInit } from '@angular/core';
import {MerchantProvidersService} from "../../shared/services/merchant-providers.service";
import {MerchantProvider} from '../../shared/models/merchant-provider.model';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';

@Component({
  selector: 'merchant-providers',
  templateUrl: './merchant-providers.component.html',
  styleUrls: ['./merchant-providers.component.scss']
})
export class MerchantProvidersComponent extends AbstractEntityIndexComponent<MerchantProvider> implements OnInit {

  constructor(
    merchantProvidersService: MerchantProvidersService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(merchantProvidersService, auth, dialog, progressBarService, paginationService);
  }

  ngOnInit() {
    this.init();
  }
}
