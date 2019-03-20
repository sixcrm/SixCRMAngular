import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router, Params, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {AbstractEntityReportIndexComponent} from '../../abstract-entity-report-index.component';
import {CustomerFiltersDialogComponent} from '../../../dialog-modals/customer-filters-dialog/customer-filters-dialog.component';
import {utc} from 'moment';
import * as moment from 'moment-timezone';
import {AnalyticsService} from '../../../shared/services/analytics.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Subscription, Observable} from 'rxjs';
import {CustomerAnalytics} from '../../../shared/models/analytics/customer-analytics.model';
import {downloadJSON, downloadCSV} from '../../../shared/utils/file.utils';

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent extends AbstractEntityReportIndexComponent<CustomerAnalytics> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'CUSTOMER_INDEX_TITLE'}];

  sub: Subscription;

  constructor(
    auth: AuthenticationService,
    dialog: MatDialog,
    router: Router,
    private route: ActivatedRoute,
    private analyticsService: AnalyticsService
  ) {
    super(auth, dialog, router);

    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('Status', (e: CustomerAnalytics) => e.status)
        .setSortName('status')
        .setCapitalize(true)
        .setMaterialIconMapper((e: CustomerAnalytics) => 'done')
        .setMaterialIconBackgroundColorMapper((e: CustomerAnalytics) => e.status === 'active' ? '#1EBEA5' : '#ED6922')
        .setMaterialIconColorMapper((e: CustomerAnalytics) => '#ffffff'),
      new ColumnParams('First Name', (e: CustomerAnalytics) => e.firstName).setSortName('firstname'),
      new ColumnParams('Last Name',(e: CustomerAnalytics) => e.lastName).setSortName('lastname'),
      new ColumnParams('Email',(e: CustomerAnalytics) => e.email).setSortName('email'),
      new ColumnParams('Phone',(e: CustomerAnalytics) => e.phone || '–').setSortName('phone'),
      new ColumnParams('City',(e: CustomerAnalytics) => e.city || '–').setSortName('city').setSelected(false),
      new ColumnParams('State', (e: CustomerAnalytics) => e.state || '–').setSortName('state').setSelected(false),
      new ColumnParams('Postal Code',(e: CustomerAnalytics) => e.zip || '–').setSortName('zip').setSelected(false),
      new ColumnParams('Created', (e: CustomerAnalytics) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSortName('created_at').setSortApplied(true),
      new ColumnParams('Last Updated', (e: CustomerAnalytics) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSortName('updated_at').setSelected(false),
      new ColumnParams('Orders', (e: CustomerAnalytics) => e.orders || '–').setSortName('orders'),
      new ColumnParams('Total Sale amt', (e: CustomerAnalytics) => e.totalSaleAmount.amount ? e.totalSaleAmount.usd() : '–').setSortName('total_sale_amount'),
      new ColumnParams('Returns', (e: CustomerAnalytics) => e.returns || '–').setSortName('returns'),
      new ColumnParams('Refunds', (e: CustomerAnalytics) => e.refunds || '–').setSortName('refunds'),
      new ColumnParams('Refund Amt', (e: CustomerAnalytics) => e.refundAmount.amount ? e.refundAmount.usd() : '–')
        .setSortName('refund_amount')
        .setColorMapper((e: CustomerAnalytics) => e.refundAmount.amount ? '#E35871' : 'black')
    ];

    this.defaultDate = {start: moment().startOf('day').subtract(1,'M'), end: moment().endOf('day')};

    this.tabs = [
      {label: 'All', selected: true, visible: true},
      {label: 'Active', selected: false, visible: true, filters: [{facet: 'customerStatus', values: ['active']}]},
      {label: 'Partial', selected: false, visible: true, filters: [{facet: 'customerStatus', values: ['partial']}]}
    ];

    this.options = ['View'];
  }


  ngOnInit() {
    this.route.queryParams.take(1).takeUntil(this.unsubscribe$).subscribe(params => {
      this.parseFiltersFromParams(params);
    })
  }

  parseFiltersFromParams(params: Params): void {
    this.parseParams(params);

    this.fetchData();
  }

  ngOnDestroy() {
    this.destroy();
  }

  optionSelected(option: {item: any, option: string}) {
    switch (option.option) {
      case 'View': {
        this.router.navigate(['/customers/advanced'], {queryParams: {customer: option.item.id}});
        break;
      }
    }
  }

  openFiltersDialog() {
    super.openFiltersDialog(CustomerFiltersDialogComponent);
  }

  private parseCustomersForDownload(customers: CustomerAnalytics[]): any {
    return customers.map(c => {
      return {
        'ID': c.id,
        'Status': c.status,
        'First Name': c.firstName,
        'Last Name': c.lastName,
        'Email': c.email,
        'Phone': c.phone,
        'State': c.status,
        'Postal Code': c.zip,
        'City': c.city,
        'Created': c.createdAt.format('MM/DD/YYYY h:mm A'),
        'Last Update': c.updatedAt.format('MM/DD/YYYY h:mm A'),
        'Orders': c.orders,
        'Total Sale Amt': c.totalSaleAmount.usd(),
        'Returns': c.returns,
        'Refunds': c.refunds,
        'Refund Amt': c.refundAmount.usd()
      };
    });
  }

  download(format: 'csv' | 'json') {
    if (format !== 'csv' && format !== 'json') return;

    this.analyticsService.getCustomers({
      start: this.date.start.clone().format(),
      end: this.date.end.clone().format(),
      orderBy: this.getSortColumn().sortName,
      sort: this.getSortColumn().sortOrder,
      facets: this.getFacets()
    }).subscribe(customers => {
      if (!customers || customers instanceof CustomServerError) {
        return;
      }

      const parsedCustomers = this.parseCustomersForDownload(customers);

      const fileName = `${this.authService.getActiveAccount().name} Customers ${utc().tz(this.authService.getTimezone()).format('MM-DD-YY')}`;

      if (format === 'json') {
        downloadJSON(parsedCustomers, fileName);
      } else {
        downloadCSV(parsedCustomers, fileName);
      }
    });

  }

  fetch() {
    this.router.navigate(
      ['/customers'],
      {
        queryParams: {
          start: this.date.start.clone().format(),
          end: this.date.end.clone().format(),
          sort: this.getSortColumn().sortName,
          sortOrder: this.getSortColumn().sortOrder,
          tab: this.getSelectedTab() ? this.getSelectedTab().label : '',
          filters: JSON.stringify(this.filters)
        },
        replaceUrl: true
      });

    this.fetchData();
  }

  fetchData() {
    this.loadingData = true;

    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.sub = this.analyticsService.getCustomers({
      start: this.date.start.clone().format(),
      end: this.date.end.clone().format(),
      limit: 25,
      offset: this.entities.length,
      orderBy: this.getSortColumn().sortName,
      sort: this.getSortColumn().sortOrder,
      facets: this.getFacets()
    }).subscribe(customers => {
      this.loadingData = false;

      if (!customers || customers instanceof CustomServerError) {
        this.entities = [];
        return;
      }

      this.entities = [...this.entities, ...customers];
      this.hasMore = customers.length === this.limit;
    });

    this.fetchCounts();
  }


  fetchCounts() {
    if (this.lastCountsDate
      && this.lastCountsDate.start.isSame(this.date.start.clone(), 'd')
      && this.lastCountsDate.end.isSame(this.date.end.clone(), 'd')
    ) {
      return;
    }

    this.lastCountsDate = {
      start: this.date.start.clone(),
      end: this.date.end.clone()
    };

    this.tabs.forEach(t => t.count = Observable.of(null));

    this.analyticsService.getCustomers({
      start: this.date.start.clone().format(),
      end: this.date.end.clone().format(),
      orderBy: 'created_at'
    }).subscribe(customers => {
      if (customers instanceof CustomServerError) {
        return;
      }

      this.tabs[0].count = Observable.of(customers.length);
      this.tabs[1].count = Observable.of(customers.filter(c=>c.status === 'active').length);
      this.tabs[2].count = Observable.of(customers.filter(c=>c.status === 'partial').length);
    });
  }

}
