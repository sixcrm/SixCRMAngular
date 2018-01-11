import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Bill} from '../../../../shared/models/bill.model';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {Currency} from '../../../../shared/utils/currency/currency';
import {AuthenticationService} from '../../../../authentication/authentication.service';

@Component({
  selector: 'invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements OnInit {

  bills: Bill[] = [];
  billsHolder: Bill[] = [];
  columnParams: ColumnParams<Bill>[] = [];

  loading: boolean = true;

  @Input() type: 'OVERDUE' | 'CURRENT' | 'PAST';
  @Input() title: string;
  @Input() subtitle: string;
  @Input() set data(data: any[]) {
    this.loading = false;
    this.billsHolder = data;
    this.reshuffle();
  };
  @Output() view: EventEmitter<Bill> = new EventEmitter();
  @Output() update: EventEmitter<Bill> = new EventEmitter();
  @Output() pay: EventEmitter<Bill> = new EventEmitter();

  limit: number = 10;
  page: number = 0;
  paginationValues: number[] = [5, 10, 15, 20, 30, 40, 50];

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    const tz = this.authService.getTimezone();
    this.columnParams  = [
      new ColumnParams('ACCOUNT_BILLING_HEADER_ISSUE', (e: Bill) => e.createdAt.clone().tz(tz).format('MM/DD/YYYY')),
      new ColumnParams('ACCOUNT_BILLING_HEADER_START', (e: Bill) => e.periodStart.clone().tz(tz).format('MM/DD/YYYY')),
      new ColumnParams('ACCOUNT_BILLING_HEADER_END', (e: Bill) => e.periodEnd.clone().tz(tz).format('MM/DD/YYYY')),
      new ColumnParams('ACCOUNT_BILLING_HEADER_BALANCE', (e: Bill) => new Currency(e.detail.map(d => d.amount.amount).reduce((a,b)=>a+b,0)).usd()).setNumberOption(true),
      new ColumnParams('ACCOUNT_BILLING_HEADER_STATUS', (e: Bill) => this.type === 'CURRENT' ? 'Due' : 'Paid').setColor(this.type === 'CURRENT' ? 'green' : '#4a4a4a'),
      new ColumnParams('ACCOUNT_BILLING_HEADER_DUE', (e: Bill) => e.availableAt.clone().tz(tz).format('MM/DD/YYYY'))
    ];
  }

  updateLimit(lim: number): void {
    if (!lim) return;

    let firstElement: number = this.page * this.limit;
    this.page = Math.floor(firstElement / lim);
    this.limit = lim;

    this.reshuffle();
  }

  next(): void {
    this.page++;
    this.reshuffle();
  }

  previous(): void {
    this.page--;
    this.reshuffle();
  }

  hasMorePages(): boolean {
    return this.billsHolder.length > this.page * this.limit + this.limit;
  }

  reshuffle(): void {
    this.bills = this.billsHolder.slice(this.page * this.limit, this.page * this.limit + this.limit);
  }

}
