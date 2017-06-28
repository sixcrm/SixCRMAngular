import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Campaign} from '../../../../shared/models/campaign.model';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {CampaignsService} from '../../../../shared/services/campaigns.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {Currency} from '../../../../shared/utils/currency/currency';

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
    dialog: MdDialog,
    paginationService: PaginationService
  ) {
    super(campaignsService, auth, dialog, paginationService);

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('Name', (e: Campaign) => e.name),
      new ColumnParams('Created at', (e: Campaign) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('Updated at', (e: Campaign) => e.updatedAt.tz(f).format('MM/DD/YYYY')),
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

  addNewCampaign() {

  }
}
