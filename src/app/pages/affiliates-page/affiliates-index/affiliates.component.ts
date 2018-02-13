import {Component, OnInit, OnDestroy} from '@angular/core';
import {AffiliatesService} from "../../../shared/services/affiliates.service";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {Affiliate} from '../../../shared/models/affiliate.model';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {UserSettingsService} from '../../../shared/services/user-settings.service';

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
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    userSettingsService: UserSettingsService
  ) {
    super(affiliatesService, auth, dialog, paginationService, router, activatedRoute, userSettingsService);

    this.entityFactory = () => new Affiliate();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('AFFILIATE_INDEX_HEADER_NAME', (e: Affiliate) => e.name),
      new ColumnParams('AFFILIATE_INDEX_HEADER_AFFILIATEID', (e: Affiliate) => e.affiliateId),
      new ColumnParams('AFFILIATE_INDEX_HEADER_CREATED', (e: Affiliate) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('AFFILIATE_INDEX_HEADER_UPDATED', (e: Affiliate) => e.updatedAt.tz(f).format('MM/DD/YYYY'))
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
