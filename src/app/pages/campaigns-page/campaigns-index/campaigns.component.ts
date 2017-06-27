import {Component, OnInit, OnDestroy} from '@angular/core';
import {CampaignsService} from "../../../shared/services/campaigns.service";
import {Campaign} from '../../../shared/models/campaign.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {Currency} from '../../../shared/utils/currency/currency';

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

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('Name', (e: Campaign) => e.name),
      new ColumnParams('Created at', (e: Campaign) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('Total products', (e: Campaign) => e.productSchedules.map(p => p.schedules.length).reduce((a, b) => a+b, 0), 'right'),
      new ColumnParams('Total Scheduled', (e: Campaign) =>
        new Currency(
          e.productSchedules
          .map(p => p.schedules)
          .reduce((a, b) => a.concat(b), [])
          .map(s => +s.price.amount)
          .reduce((a, b) => a+b, 0)).usd()
        , 'right')
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
