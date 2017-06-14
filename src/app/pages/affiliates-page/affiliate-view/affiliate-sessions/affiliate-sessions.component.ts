import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Session} from '../../../../shared/models/session.model';
import {SessionsService} from '../../../../shared/services/sessions.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {ProgressBarService} from '../../../../shared/services/progress-bar.service';
import {MdDialog} from '@angular/material';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {sessionsByAffiliate, sessionsInfoListQuery} from '../../../../shared/utils/query-builder';
import {Currency} from '../../../../shared/utils/currency/currency';

@Component({
  selector: 'affiliate-sessions',
  templateUrl: './affiliate-sessions.component.html',
  styleUrls: ['./affiliate-sessions.component.scss']
})
export class AffiliateSessionsComponent extends AbstractEntityIndexComponent<Session> implements OnInit, OnDestroy {

  @Input() affiliateId: string;

  constructor(
    sessionService: SessionsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(sessionService, auth, dialog, progressBarService, paginationService);

    this.columnParams = [
      new ColumnParams('Customer', (e: Session) => `${e.customer.firstName} ${e.customer.lastName}`),
      new ColumnParams('Campaign', (e: Session) => e.campaign.name),
      new ColumnParams('Total Rebills', (e: Session) =>
        new Currency(
          e.rebills
            .map(r => r.amount.amount)
            .reduce((a, b) => a + b, 0))
            .usd(),
        'right'),
      new ColumnParams('Total Scheduled', (e: Session) =>
        new Currency(
          e.productSchedules
            .map(p => p.schedules)
            .reduce((a, b) => a.concat(b), [])
            .map(s => +s.price.amount)
            .reduce((a, b) => a+b, 0)).usd(),
        'right')
    ];
  }

  ngOnInit() {
    this.service.indexQuery = (limit?: number, cursor?: string) => sessionsByAffiliate(this.affiliateId, limit, cursor);
    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = sessionsInfoListQuery;
    this.destroy();
  }
}

