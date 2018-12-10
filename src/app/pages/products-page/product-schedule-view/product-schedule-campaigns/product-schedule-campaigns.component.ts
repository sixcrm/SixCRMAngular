import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Campaign} from '../../../../shared/models/campaign.model';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {CampaignsService} from '../../../../entity-services/services/campaigns.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {Currency} from '../../../../shared/utils/currency/currency';
import {
  campaignsByProductSchedule,
  campaignsInfoListQuery
} from '../../../../shared/utils/queries/entities/campaign.queries';
import {IndexQueryParameters} from '../../../../shared/utils/queries/index-query-parameters.model';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'product-schedule-campaigns',
  templateUrl: 'product-schedule-campaigns.component.html',
  styleUrls: ['product-schedule-campaigns.component.scss']
})
export class ProductScheduleCampaignsComponent extends AbstractEntityIndexComponent<Campaign> implements OnInit, OnDestroy {

  @Input() id: string;

  constructor(
    campaignService: CampaignsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(campaignService, auth, dialog, paginationService, router, activatedRoute);

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('PRODUCTSCHEDULE_CAMPAIGN_NAME', (e: Campaign) => e.name),
      new ColumnParams('PRODUCTSCHEDULE_CAMPAIGN_CREATED', (e: Campaign) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('PRODUCTSCHEDULE_CAMPAIGN_PRODUCTNUM', (e: Campaign) => e.productSchedules.map(p => p.schedules.length).reduce((a, b) => a+b, 0), 'right').setNumberOption(true),
      new ColumnParams('PRODUCTSCHEDULE_CAMPAIGN_SCHEDULEDNUM', (e: Campaign) =>
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
    this.service.indexQuery = (params: IndexQueryParameters) => campaignsByProductSchedule(this.id, params);
    this.init(!!this.id);
  }

  ngOnDestroy() {
    this.service.indexQuery = campaignsInfoListQuery;
    this.destroy();
  }
}
