import {Component, OnInit, OnDestroy} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {RebillsService} from '../../../shared/services/rebills.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PaginationService} from '../../../shared/services/pagination.service';
import {MdDialog} from '@angular/material';
import {ColumnParams} from '../../../shared/models/column-params.model';

@Component({
  selector: 'rebills',
  templateUrl: './rebills.component.html',
  styleUrls: ['./rebills.component.scss']
})
export class RebillsComponent extends AbstractEntityIndexComponent<Rebill> implements OnInit, OnDestroy {

  constructor(
    service: RebillsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(service, auth, dialog, paginationService, router, activatedRoute);

    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('REBILL_INDEX_HEADER_ID', (e: Rebill) => e.id),
      new ColumnParams('REBILL_INDEX_HEADER_BILL',(e: Rebill) => e.billAt ? e.billAt.tz(f).format('MM/DD/YYYY') : 'not billed'),
      new ColumnParams('REBILL_INDEX_HEADER_CREATED', (e: Rebill) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('REBILL_INDEX_HEADER_AMOUNT', (e: Rebill) => e.amount.usd(), 'right')
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
