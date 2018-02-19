import {Component, OnInit, OnDestroy} from '@angular/core';
import {CampaignsService} from "../../../shared/services/campaigns.service";
import {Campaign} from '../../../shared/models/campaign.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {Currency} from '../../../shared/utils/currency/currency';
import {LoadBalancerAssociationsService} from '../../../shared/services/load-balancer-associations.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent extends AbstractEntityIndexComponent<Campaign> implements OnInit, OnDestroy {

  constructor(
    campaignService: CampaignsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    private loadBalancerAssociationService: LoadBalancerAssociationsService
  ) {
    super(campaignService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new Campaign();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('CAMPAIGN_INDEX_HEADER_NAME', (e: Campaign) => e.name),
      new ColumnParams('CAMPAIGN_INDEX_HEADER_PRODUCTNUM', (e: Campaign) => e.productSchedules.map(p => p.schedules.length).reduce((a, b) => a+b, 0) + '', 'right').setNumberOption(true),
      new ColumnParams('CAMPAIGN_INDEX_HEADER_SCHEDULEDNUM', (e: Campaign) =>
        new Currency(
          e.productSchedules
          .map(p => p.schedules)
          .reduce((a, b) => a.concat(b), [])
          .map(s => +s.price.amount)
          .reduce((a, b) => a+b, 0)).usd()
        , 'right').setNumberOption(true),
      new ColumnParams('CAMPAIGN_INDEX_HEADER_CREATED', (e: Campaign) => e.createdAt.tz(f).format('MM/DD/YYYY'))
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
    if (campaign.loadbalancerAssociations && campaign.loadbalancerAssociations.length === 1) {

      this.loadBalancerAssociationService.entityCreated$.take(1).takeUntil(this.unsubscribe$).subscribe(lba => {
        if (lba instanceof CustomServerError) return;

        this.viewEntity(lba.entity)
      });

      this.service.entityCreated$.take(1).takeUntil(this.unsubscribe$).subscribe(c => {
        if (c instanceof CustomServerError) return;

        const lba = campaign.loadbalancerAssociations[0].copy();
        lba.entity = c.id;
        lba.entityType = 'campaign';
        lba.campaign = c.inverse();

        this.loadBalancerAssociationService.createEntity(lba);
      });

    }

    this.createEntity(campaign);
  }
}
