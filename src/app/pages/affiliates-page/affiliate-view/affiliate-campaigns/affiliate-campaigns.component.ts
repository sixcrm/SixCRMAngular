import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Campaign} from '../../../../shared/models/campaign.model';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {CampaignsService} from '../../../../entity-services/services/campaigns.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {Currency} from '../../../../shared/utils/currency/currency';
import {campaignsInfoListQuery, campaignsByAffiliate} from '../../../../shared/utils/queries/entities/campaign.queries';
import {IndexQueryParameters} from '../../../../shared/utils/queries/index-query-parameters.model';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'affiliate-campaigns',
  templateUrl: './affiliate-campaigns.component.html',
  styleUrls: ['./affiliate-campaigns.component.scss']
})
export class AffiliateCampaignsComponent extends AbstractEntityIndexComponent<Campaign> implements OnInit, OnDestroy {

  @Input() affiliateId: string;

  constructor(
    campaignsService: CampaignsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService
  ) {
    super(campaignsService, auth, dialog, paginationService);

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('AFFILIATE_CAMPAIGN_NAME', (e: Campaign) => e.name),
      new ColumnParams('AFFILIATE_CAMPAIGN_CREATED', (e: Campaign) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('AFFILIATE_CAMPAIGN_UPDATED', (e: Campaign) => e.updatedAt.tz(f).format('MM/DD/YYYY'))
    ];
  }

  ngOnInit() {
    this.service.indexQuery = (params: IndexQueryParameters) => campaignsByAffiliate(this.affiliateId, params);

    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = campaignsInfoListQuery;

    this.destroy();
  }

}
