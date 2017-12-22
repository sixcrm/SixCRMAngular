import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Session} from '../../../../shared/models/session.model';
import {SessionsService} from '../../../../shared/services/sessions.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {Currency} from '../../../../shared/utils/currency/currency';
import {sessionsByAffiliate, sessionsInfoListQuery} from '../../../../shared/utils/queries/entities/session.queries';

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
    paginationService: PaginationService
  ) {
    super(sessionService, auth, dialog, paginationService);

    this.columnParams = [
      new ColumnParams('AFFILIATE_SESSION_CUSTOMER', (e: Session) => `${e.customer.firstName} ${e.customer.lastName}`),
      new ColumnParams('AFFILIATE_SESSION_CAMPAIGN', (e: Session) => e.campaign.name),
      new ColumnParams('AFFILIATE_SESSION_REBILLTOTAL', (e: Session) =>
        new Currency(
          e.rebills
            .map(r => r.amount.amount)
            .reduce((a, b) => a + b, 0))
            .usd(),
        'right'),
      new ColumnParams('AFFILIATE_SESSION_SCHEDULEDTOTAL', (e: Session) =>
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

