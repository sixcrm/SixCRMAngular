import {Component, OnInit, OnDestroy} from '@angular/core';
import {CustomersService} from "../../../entity-services/services/customers.service";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {Customer} from '../../../shared/models/customer.model';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {FilterTableTab} from '../../../shared/components/filter-table/filter-table.component';
import {utc, Moment} from 'moment';

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent extends AbstractEntityIndexComponent<Customer> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'CUSTOMER_INDEX_TITLE'}];

  date: {start: Moment, end: Moment} = {start: utc().subtract(1,'M'), end: utc()};

  tabs: FilterTableTab[] = [
    {label: 'All', selected: true, visible: true},
    {label: 'Active', selected: false, visible: true},
    {label: 'Partial', selected: false, visible: true},
    {label: 'Blacklisted', selected: false, visible: true}
  ];

  options = ['View'];

  constructor(
    customersService: CustomersService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(customersService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new Customer();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('CUSTOMER_INDEX_HEADER_ID', (e: Customer) => e.id).setSelected(false),
      new ColumnParams('CUSTOMER_INDEX_HEADER_FIRSTNAME', (e: Customer) => e.firstName),
      new ColumnParams('CUSTOMER_INDEX_HEADER_LASTNAME',(e: Customer) => e.lastName),
      new ColumnParams('CUSTOMER_INDEX_HEADER_EMAIL',(e: Customer) => e.email).setSelected(false),
      new ColumnParams('CUSTOMER_INDEX_HEADER_PHONE',(e: Customer) => e.phone).setSelected(false),
      new ColumnParams('CUSTOMER_INDEX_HEADER_COUNTRY',(e: Customer) => e.address.country).setSelected(false),
      new ColumnParams('CUSTOMER_INDEX_HEADER_STATE', (e: Customer) => e.address.state),
      new ColumnParams('CUSTOMER_INDEX_HEADER_CITY', (e: Customer) => e.address.city),
      new ColumnParams('CUSTOMER_INDEX_HEADER_ZIP',(e: Customer) => e.address.zip).setSelected(false),
      new ColumnParams('CUSTOMER_INDEX_HEADER_LINE1',(e: Customer) => e.address.line1).setSelected(false),
      new ColumnParams('CUSTOMER_INDEX_HEADER_CREATED', (e: Customer) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('CUSTOMER_INDEX_HEADER_UPDATED', (e: Customer) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  ngOnInit() {
    this.shareLimit = false;
    this.limit = 25;
    this.setInfiniteScroll(true);

    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  selectTab(tab: FilterTableTab) {
    this.tabs = this.tabs.map(t => {
      t.selected = t.label === tab.label;

      return t;
    });

    this.refetch();
  }

  changeDate(date: {start: Moment, end: Moment}) {
    this.date = date;

    this.refetch();
  }

  refetch() {
    this.loadingData = true;
    this.resetEntities();
    this.service.getEntities(this.limit)
  }

  optionSelected(option: {item: any, option: string}) {
    switch (option.option) {
      case 'View': {
        this.router.navigate(['/customers', option.item.id]);
        break;
      }
    }
  }

  loadMore() {
    if (!this.loadingData && this.hasMore) {
      this.loadingData = true;
      this.service.getEntities(20);
    }
  }


}
