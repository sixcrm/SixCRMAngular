import {Component, OnInit, OnDestroy} from '@angular/core';
import {Location} from '@angular/common';
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
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';

@Component({
  selector: 'campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent extends AbstractEntityIndexComponent<Campaign> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'CAMPAIGN_INDEX_TITLE'}];

  isBasicAccount: boolean;

  constructor(
    campaignService: CampaignsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    location: Location,
    private merchantProviderGroupAssociationService: MerchantProviderGroupAssociationsService
  ) {
    super(campaignService, auth, dialog, paginationService, router, activatedRoute, location);

    this.entityFactory = () => new Campaign();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('CAMPAIGN_INDEX_HEADER_ID', (e: Campaign) => e.id).setSelected(false),
      new ColumnParams('CAMPAIGN_INDEX_HEADER_NAME', (e: Campaign) => e.name),
      new ColumnParams('CAMPAIGN_INDEX_HEADER_SHOWPREPAID', (e: Campaign) => e.showPrepaid + '').setSelected(false),
      new ColumnParams('CAMPAIGN_INDEX_HEADER_ALLOWPREPAID', (e: Campaign) => e.allowPrepaid + '').setSelected(false),
      new ColumnParams('CAMPAIGN_INDEX_HEADER_CREATED', (e: Campaign) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('CAMPAIGN_INDEX_HEADER_UPDATED', (e: Campaign) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];

    const plan = this.authService.getActiveAccount().billing.plan;
    this.isBasicAccount = plan === 'basic';
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  createCampaign(campaign: Campaign) {
    if (this.isBasicAccount && this.entities.length !== 0) return;

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
