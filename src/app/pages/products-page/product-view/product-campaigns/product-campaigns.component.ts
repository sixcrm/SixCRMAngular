import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Campaign} from '../../../../shared/models/campaign.model';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {CampaignsService} from '../../../../shared/services/campaigns.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {campaignsByProduct, campaignsInfoListQuery} from '../../../../shared/utils/queries/entities/campaign.queries';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {Currency} from '../../../../shared/utils/currency/currency';

@Component({
  selector: 'product-campaigns',
  templateUrl: './product-campaigns.component.html',
  styleUrls: ['./product-campaigns.component.scss']
})
export class ProductCampaignsComponent extends AbstractEntityIndexComponent<Campaign> implements OnInit, OnDestroy {

  @Input() id: string;

  constructor(
    campaignService: CampaignsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(campaignService, auth, dialog, paginationService, router, activatedRoute);

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('PRODUCT_CAMPAIGN_NAME', (e: Campaign) => e.name),
      new ColumnParams('PRODUCT_CAMPAIGN_CREATED', (e: Campaign) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('PRODUCT_CAMPAIGN_PRODUCTNUM', (e: Campaign) => e.productSchedules.map(p => p.schedules.length).reduce((a, b) => a+b, 0), 'right').setNumberOption(true),
      new ColumnParams('PRODUCT_CAMPAIGN_SCHEDULEDNUM', (e: Campaign) =>
          new Currency(
            e.productSchedules
              .map(p => p.schedules)
              .reduce((a, b) => a.concat(b), [])
              .map(s => +s.price.amount)
              .reduce((a, b) => a+b, 0)).usd()
        , 'right').setNumberOption(true)
    ];
  }

  ngOnInit() {
    this.service.indexQuery = (limit?: number, cursor?: string) => campaignsByProduct(this.id, limit, cursor);
    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = campaignsInfoListQuery;
    this.destroy();
  }
}
