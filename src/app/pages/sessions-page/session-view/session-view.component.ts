import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Session} from '../../../shared/models/session.model';
import {SessionsService} from '../../../shared/services/sessions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {Rebill} from '../../../shared/models/rebill.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Campaign} from '../../../shared/models/campaign.model';
import {Affiliate} from '../../../shared/models/affiliate.model';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';

@Component({
  selector: 'session-view',
  templateUrl: './session-view.component.html',
  styleUrls: ['./session-view.component.scss']
})
export class SessionViewComponent extends AbstractEntityViewComponent<Session> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  rebillColumnParams: ColumnParams<Rebill>[];
  rebillText: TableMemoryTextOptions = {
    title: 'SESSION_REBILL_TITLE',
    viewOptionText: 'SESSION_REBILL_VIEW',
    noDataText: 'SESSION_REBILL_NODATA'
  };

  campaignColumnParams: ColumnParams<Campaign>[];
  campaignText: TableMemoryTextOptions = {
    title: 'SESSION_CAMPAIGN_TITLE',
    viewOptionText: 'SESSION_CAMPAIGN_VIEW',
    noDataText: 'SESSION_CAMPAIGN_NODATA'
  };

  affiliateColumnParams: ColumnParams<Affiliate>[];
  affiliateText: TableMemoryTextOptions = {
    title: 'SESSION_AFFILIATE_TITLE',
    viewOptionText: 'SESSION_AFFILIATE_VIEW',
    noDataText: 'SESSION_AFFILIATE_NODATA'
  };

  affiliates: Affiliate[] = [];

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'SESSION_TAB_GENERAL'},
    {name: 'affiliates', label: 'SESSION_TAB_AFFILIATE'}
  ];

  constructor(service: SessionsService,
              route: ActivatedRoute,
              public navigation: NavigationService,
              private authService: AuthenticationService,
              private router: Router
  ) {
    super(service, route);
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());

    let f = this.authService.getTimezone();
    this.rebillColumnParams = [
      new ColumnParams('SESSION_REBILL_BILLED',(e: Rebill) => e.billAt ? e.billAt.clone().tz(f).format('MM/DD/YYYY') : 'not billed'),
      new ColumnParams('SESSION_REBILL_AMOUNT', (e: Rebill) => e.amount.usd(), 'right')
    ];


    this.campaignColumnParams = [
      new ColumnParams('SESSION_CAMPAIGN_NAME',(e: Campaign) => e.name),
      new ColumnParams('SESSION_CAMPAIGN_CREATED', (e: Campaign) => e.createdAt.clone().tz(f).format('MM/DD/YYYY'))
    ];

    this.affiliateColumnParams = [
      new ColumnParams('SESSION_AFFILIATE_NAME',(e: Affiliate) => e.name),
      new ColumnParams('SESSION_AFFILIATE_ID',(e: Affiliate) => e.affiliateId),
      new ColumnParams('SESSION_AFFILIATE_CREATED', (e: Affiliate) => e.createdAt.clone().tz(f).format('MM/DD/YYYY'))
    ];

    this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe((s: Session) => this.affiliates = s.parseAffiliates());
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }

  viewRebill(rebill: Rebill): void {
    this.router.navigate(['/rebills', rebill.id]);
  }

  viewCampaign(campaign: Campaign): void {
    this.router.navigate(['/campaigns', campaign.id]);
  }

  viewAffiliate(affiliate: Affiliate): void {
    this.router.navigate(['/affiliates', affiliate.id]);
  }

}
