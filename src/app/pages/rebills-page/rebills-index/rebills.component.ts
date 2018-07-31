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
import {utc, Moment} from 'moment';
import {FilterTableTab} from '../../../shared/components/filter-table/filter-table.component';
import {AbstractEntityReportIndexComponent} from '../../abstract-entity-report-index.component';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'rebills',
  templateUrl: './rebills.component.html',
  styleUrls: ['./rebills.component.scss']
})
export class RebillsComponent extends AbstractEntityReportIndexComponent<Rebill> implements OnInit, OnDestroy {

  title = 'REBILL_INDEX_TITLE';

  crumbItems: BreadcrumbItem[] = [{label: () => this.title}];

  rebills: Rebill[] = [];

  constructor(
    protected service: RebillsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    router: Router,
  ) {
    super(auth, dialog, router);

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

    this.date = {start: utc().subtract(1,'M'), end: utc()};

    this.tabs = [
      {label: 'All', selected: true, visible: true},
      {label: 'Shipped', selected: false, visible: true},
      {label: 'Closed', selected: false, visible: true},
      {label: 'Errors', selected: false, visible: true},
      {label: 'Refunds', selected: false, visible: true},
      {label: 'Returns', selected: false, visible: true},
      {label: 'Chargebacks', selected: false, visible: true}
    ];

    this.options = ['View'];
  }

  ngOnInit() {
    this.service.entities$.takeUntil(this.unsubscribe$).subscribe(rebills => {
      if (rebills instanceof CustomServerError) {
        this.rebills = [];
        return;
      }

      this.rebills = rebills;
    });

    this.service.getEntities(20);
  }

  ngOnDestroy() {
    this.destroy();
  }

  optionSelected(option: {item: any, option: string}) {
    switch (option.option) {
      case 'View': {
        this.router.navigate(['/rebills', option.item.id]);
        break;
      }
    }
  }

  oFiltersDialog() {

  }

}
