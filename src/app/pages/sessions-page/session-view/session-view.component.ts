import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Session} from '../../../shared/models/session.model';
import {SessionsService} from '../../../shared/services/sessions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {NavigationService} from '../../../navigation/navigation.service';
import {Rebill} from '../../../shared/models/rebill.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Campaign} from '../../../shared/models/campaign.model';

@Component({
  selector: 'session-view',
  templateUrl: './session-view.component.html',
  styleUrls: ['./session-view.component.scss']
})
export class SessionViewComponent extends AbstractEntityViewComponent<Session> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  rebillColumnParams: ColumnParams<Rebill>[];
  campaignColumnParams: ColumnParams<Campaign>[];

  constructor(service: SessionsService,
              route: ActivatedRoute,
              progressBarService: ProgressBarService,
              public navigation: NavigationService,
              private authService: AuthenticationService,
              private router: Router
  ) {
    super(service, route, progressBarService);
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

}
