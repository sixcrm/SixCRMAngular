import {Component, OnInit, OnDestroy} from '@angular/core';
import {CampaignsService} from "../../shared/services/campaigns.service";
import {Campaign} from '../../shared/models/campaign.model';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../shared/models/column-params.model';

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
    progressBarService: ProgressBarService,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(campaignService, auth, dialog, progressBarService, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('ID', (e: Campaign) => e.id),
      new ColumnParams('Number Of Merchant Providers',(e: Campaign) => e.loadBalancer.merchantProviderConfigurations.length.toString()),
      new ColumnParams('Number Of Product Schedules', (e: Campaign) => e.productSchedules.length.toString())
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
