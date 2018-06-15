import {Component, OnInit, OnDestroy} from '@angular/core';
import {CampaignsService} from "../../../entity-services/services/campaigns.service";
import {Campaign} from '../../../shared/models/campaign.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {Currency} from '../../../shared/utils/currency/currency';
import {MerchantProviderGroupAssociationsService} from '../../../entity-services/services/merchant-provider-group-associations.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent extends AbstractEntityIndexComponent<Campaign> implements OnInit, OnDestroy {

  constructor(
    campaignService: CampaignsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    private merchantProviderGroupAssociationService: MerchantProviderGroupAssociationsService
  ) {
    super(campaignService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new Campaign();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('CAMPAIGN_INDEX_HEADER_ID', (e: Campaign) => e.id).setSelected(false),
      new ColumnParams('CAMPAIGN_INDEX_HEADER_NAME', (e: Campaign) => e.name),
      new ColumnParams('CAMPAIGN_INDEX_HEADER_SHOWPREPAID', (e: Campaign) => e.showPrepaid + '').setSelected(false),
      new ColumnParams('CAMPAIGN_INDEX_HEADER_ALLOWPREPAID', (e: Campaign) => e.allowPrepaid + '').setSelected(false),
      new ColumnParams('CAMPAIGN_INDEX_HEADER_PRODUCTNUM', (e: Campaign) => e.productSchedules.map(p => p.schedules.length).reduce((a, b) => a+b, 0) + '', 'right').setNumberOption(true),
      new ColumnParams('CAMPAIGN_INDEX_HEADER_SCHEDULEDNUM', (e: Campaign) =>
        new Currency(
          e.productSchedules
          .map(p => p.schedules)
          .reduce((a, b) => a.concat(b), [])
          .map(s => +s.price.amount)
          .reduce((a, b) => a+b, 0)).usd()
        , 'right'),
      new ColumnParams('CAMPAIGN_INDEX_HEADER_CREATED', (e: Campaign) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('CAMPAIGN_INDEX_HEADER_UPDATED', (e: Campaign) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  ngOnInit() {
    this.viewAfterCrate = false;

    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  createCampaign(campaign: Campaign) {
    if (campaign.merchantProviderGroupAssociations && campaign.merchantProviderGroupAssociations.length === 1) {

      this.merchantProviderGroupAssociationService.entityCreated$.take(1).takeUntil(this.unsubscribe$).subscribe(lba => {
        if (lba instanceof CustomServerError) return;

        this.viewEntity(lba.entity)
      });

      this.service.entityCreated$.take(1).takeUntil(this.unsubscribe$).subscribe(c => {
        if (c instanceof CustomServerError) return;

        const lba = campaign.merchantProviderGroupAssociations[0].copy();
        lba.entity = c.id;
        lba.entityType = 'campaign';
        lba.campaign = c.inverse();

        this.merchantProviderGroupAssociationService.createEntity(lba);
      });

    }

    this.createEntity(campaign);
  }
}
