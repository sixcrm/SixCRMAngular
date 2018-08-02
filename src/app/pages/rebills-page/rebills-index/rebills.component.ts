import {Component, OnInit, OnDestroy} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {RebillsService} from '../../../entity-services/services/rebills.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PaginationService} from '../../../shared/services/pagination.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';

@Component({
  selector: 'rebills',
  templateUrl: './rebills.component.html',
  styleUrls: ['./rebills.component.scss']
})
export class RebillsComponent extends AbstractEntityIndexComponent<Rebill> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'REBILL_INDEX_TITLE'}];

  constructor(
    service: RebillsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(service, auth, dialog, paginationService, router, activatedRoute);

    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('REBILL_INDEX_HEADER_ID', (e: Rebill) => e.id).setSelected(false),
      new ColumnParams('REBILL_INDEX_HEADER_AMOUNT', (e: Rebill) => e.amount.usd(), 'right'),
      new ColumnParams('REBILL_INDEX_HEADER_BILL',(e: Rebill) => e.billAt ? e.billAt.tz(f).format('MM/DD/YYYY') : 'not billed'),
      new ColumnParams('REBILL_INDEX_HEADER_CUSTOMER',(e: Rebill) => `${e.parentSession.customer.firstName} ${e.parentSession.customer.lastName}`),
      new ColumnParams('REBILL_INDEX_HEADER_STATE',(e: Rebill) => e.state),
      new ColumnParams('REBILL_INDEX_HEADER_CREATED', (e: Rebill) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('REBILL_INDEX_HEADER_UPDATED', (e: Rebill) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}