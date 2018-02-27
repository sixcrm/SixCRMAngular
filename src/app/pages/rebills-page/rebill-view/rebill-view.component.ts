import {Component, OnInit, OnDestroy} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {RebillsService} from '../../../shared/services/rebills.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {ShippingReceipt} from '../../../shared/models/shipping-receipt.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {Transaction} from '../../../shared/models/transaction.model';
import {BreadcrumbItem} from '../../components/entity-view-breadcrumbs/entity-view-breadcrumbs.component';

@Component({
  selector: 'rebill-view',
  templateUrl: './rebill-view.component.html',
  styleUrls: ['./rebill-view.component.scss']
})
export class RebillViewComponent extends AbstractEntityViewComponent<Rebill> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  billdate: string;
  billamount: string;
  customername: string;

  shippingReceiptColumnParams: ColumnParams<ShippingReceipt>[];

  shippingReceiptText: TableMemoryTextOptions = {
    title: 'REBILL_SHIPPINGRECEIPT_TITLE',
    noDataText: 'REBILL_SHIPPINGRECEIPT_NODATA'
  };

  productScheduleColumnParams: ColumnParams<ProductSchedule>[];

  productScheduleText: TableMemoryTextOptions = {
    title: 'REBILL_PRODUCTSCHEDULE_TITLE',
    noDataText: 'REBILL_PRODUCTSCHEDULE_NODATA'
  };

  transactionColumnParams: ColumnParams<Transaction>[];

  transactionText: TableMemoryTextOptions = {
    title: 'REBILL_TRANSACTION_TITLE',
    noDataText: 'REBILL_TRANSACTION_NODATA'
  };

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'REBILL_TAB_GENERAL'},
    {name: 'transactions', label: 'REBILL_TAB_TRANSACTIONS'},
    {name: 'receipts', label: 'REBILL_TAB_RECEIPTS'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'REBILL_INDEX_TITLE', url: '/rebills'},
    {label: () => this.entity.id}
  ];

  constructor(
    service: RebillsService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public router: Router,
    private authService: AuthenticationService
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    let f = this.authService.getTimezone();

    this.shippingReceiptColumnParams = [
      new ColumnParams('REBILL_SHIPPINGRECEIPT_STATUS', (e: ShippingReceipt) => e.parseStatus()).setTranslateOption(true),
      new ColumnParams('REBILL_SHIPPINGRECEIPT_TRACKINGNUMBER',(e: ShippingReceipt) => e.tracking.id).setCopyOption(true),
      new ColumnParams('REBILL_SHIPPINGRECEIPT_CREATED', (e: ShippingReceipt) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('REBILL_SHIPPINGRECEIPT_UPDATED', (e: ShippingReceipt) => e.updatedAt.tz(f).format('MM/DD/YYYY'))
    ];

    this.productScheduleColumnParams = [
      new ColumnParams('REBILL_PRODUCTSCHEDULE_NAME', (e: ProductSchedule) => e.name),
      new ColumnParams('REBILL_PRODUCTSCHEDULE_MERCHANTPROVIDERGROUP', (e: ProductSchedule) => e.merchantProviderGroup.name),
      new ColumnParams('REBILL_PRODUCTSCHEDULE_COUNT', (e: ProductSchedule) => e.schedules.length.toString(), 'right').setNumberOption(true)
    ];

    this.transactionColumnParams = [
      new ColumnParams('REBILL_TRANSACTION_ALIAS', (e: Transaction) => e.alias),
      new ColumnParams('REBILL_TRANSACTION_AMOUNT', (e: Transaction) => e.amount.usd(), 'right'),
      new ColumnParams('REBILL_TRANSACTION_RESPONSE', (e: Transaction) => e.processorResponse.message),
      new ColumnParams('REBILL_TRANSACTION_CREATED', (e: Transaction) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('REBILL_TRANSACTION_UPDATED', (e: Transaction) => e.updatedAt.tz(f).format('MM/DD/YYYY'))
    ];

    this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe(entity => {
      if (entity instanceof CustomServerError) {
        this.router.navigate(['/error']);
        return;
      }

      this.billdate = entity.billAt.format('MM/DD/YYYY');
      this.billamount = entity.amount.usd();
      this.customername = entity.parentSession.customer.firstName + ' ' + entity.parentSession.customer.lastName;
    })
  }

  goToSession() {
    if (!this.entity.parentSession.id) return;

    this.router.navigate(['/sessions', this.entity.parentSession.id]);
  }

  goToCustomer() {
    if (!this.entity.parentSession.customer.id) return;

    this.router.navigate(['/customers', this.entity.parentSession.customer.id]);
  }

  goToShippingReceipt(shippingReceipt: ShippingReceipt) {
    if (!shippingReceipt.id) return;

    this.router.navigate(['/shippingreceipts', shippingReceipt.id])
  }

  goToProductSchedule(productSchedule: ProductSchedule) {
    if (!productSchedule.id) return;

    this.router.navigate(['/productschedules', productSchedule.id])
  }

  goToTransaction(transaction: Transaction) {
    if (!transaction.id) return;

    this.router.navigate(['/transactions', transaction.id])
  }

  setIndex(index: number): void {
    this.selectedIndex = index;
  }

  ngOnDestroy() {
    this.destroy();
  }
}
