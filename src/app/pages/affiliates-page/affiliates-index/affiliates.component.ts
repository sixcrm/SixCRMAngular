import {Component, OnInit, OnDestroy} from '@angular/core';
import {AffiliatesService} from "../../../shared/services/affiliates.service";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {Affiliate} from '../../../shared/models/affiliate.model';
import {MdDialog} from '@angular/material';
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
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(affiliatesService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new Affiliate();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('AFFILIATE_INDEX_HEADER_ID', (e: Affiliate) => e.id).setSelected(false),
      new ColumnParams('AFFILIATE_INDEX_HEADER_NAME', (e: Affiliate) => e.name),
      new ColumnParams('AFFILIATE_INDEX_HEADER_AFFILIATEID', (e: Affiliate) => e.affiliateId),
      new ColumnParams('AFFILIATE_INDEX_HEADER_CREATED', (e: Affiliate) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('AFFILIATE_INDEX_HEADER_UPDATED', (e: Affiliate) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
