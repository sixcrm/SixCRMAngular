import {Component, OnInit, OnDestroy} from '@angular/core';
import {AffiliatesService} from "../../../shared/services/affiliates.service";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {Affiliate} from '../../../shared/models/affiliate.model';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';

@Component({
  selector: 'affiliates',
  templateUrl: './affiliates.component.html',
  styleUrls: ['./affiliates.component.scss']
})
export class AffiliatesComponent extends AbstractEntityIndexComponent<Affiliate> implements OnInit, OnDestroy {

  constructor(
    affiliatesService: AffiliatesService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(affiliatesService, auth, dialog, progressBarService, paginationService, router, activatedRoute);

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('Name', (e: Affiliate) => e.name),
      new ColumnParams('Affiliate ID', (e: Affiliate) => e.affiliateId),
      new ColumnParams('Created At', (e: Affiliate) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('Updated At', (e: Affiliate) => e.updatedAt.tz(f).format('MM/DD/YYYY'))
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
