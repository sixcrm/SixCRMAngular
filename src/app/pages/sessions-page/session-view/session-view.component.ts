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

@Component({
  selector: 'session-view',
  templateUrl: './session-view.component.html',
  styleUrls: ['./session-view.component.scss']
})
export class SessionViewComponent extends AbstractEntityViewComponent<Session> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  rebillColumnParams: ColumnParams<Rebill>[];
  campaignColumnParams: ColumnParams<Campaign>[];
  affiliateColumnParams: ColumnParams<Affiliate>[];

  affiliates: Affiliate[] = [];

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
      new ColumnParams('Bill At',(e: Rebill) => e.billAt ? e.billAt.clone().tz(f).format('MM/DD/YYYY') : 'not billed'),
      new ColumnParams('Amount', (e: Rebill) => e.amount.usd(), 'right')
    ];


    this.campaignColumnParams = [
      new ColumnParams('Name',(e: Campaign) => e.name),
      new ColumnParams('Created at', (e: Campaign) => e.createdAt.clone().tz(f).format('MM/DD/YYYY'))
    ];

    this.affiliateColumnParams = [
      new ColumnParams('Name',(e: Affiliate) => e.name),
      new ColumnParams('Affiliate ID',(e: Affiliate) => e.affiliateId),
      new ColumnParams('Created at', (e: Affiliate) => e.createdAt.clone().tz(f).format('MM/DD/YYYY'))
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
