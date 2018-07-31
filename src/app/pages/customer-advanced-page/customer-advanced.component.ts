import {Component, OnInit, ViewChild, OnDestroy, ElementRef} from '@angular/core';
import {Customer} from '../../shared/models/customer.model';
import {CustomersService} from '../../entity-services/services/customers.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NavigationService} from '../../navigation/navigation.service';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {TabHeaderElement} from '../../shared/components/tab-header/tab-header.component';
import {CustomerInfoNotesComponent} from './customer-info-notes/customer-info-notes.component';
import {BreadcrumbItem} from '../components/models/breadcrumb-item.model';
import {AsyncSubject, Subject} from 'rxjs';
import {SessionsService} from '../../entity-services/services/sessions.service';
import {Rebill} from '../../shared/models/rebill.model';
import {RebillsService} from '../../entity-services/services/rebills.service';
import {utc} from 'moment';
import {OrdersService} from '../../entity-services/services/orders.service';
import {Order} from '../../shared/models/order.model';
import {Transaction} from '../../shared/models/transaction.model';
import {ShippingReceiptsService} from '../../entity-services/services/shipping-receipts.service';
import {ShippingReceipt} from '../../shared/models/shipping-receipt.model';
import {ProductSchedule} from '../../shared/models/product-schedule.model';
import {Session} from '../../shared/models/session.model';
import {TransactionsService} from '../../entity-services/services/transactions.service';
import {YesNoDialogComponent} from '../../dialog-modals/yes-no-dialog.component';
import {MatDialog} from '@angular/material';
import {firstIndexOf} from '../../shared/utils/array.utils';

@Component({
  selector: 'customer-advanced',
  templateUrl: './customer-advanced.component.html',
  styleUrls: ['./customer-advanced.component.scss']
})
export class CustomerAdvancedComponent implements OnInit, OnDestroy {

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'Customers', url: '/customers'}
  ];

  tabHeaders: TabHeaderElement[] = [
    {name: 'subscriptions', label: 'SUBSCRIPTIONS'},
    {name: 'orders', label: 'ORDERS'},
    {name: 'transactions', label: 'TRANSACTIONS'},
    {name: 'fulfillment', label: 'FULFILLMENT'},
    {name: 'activity', label: 'ACTIVITY'}
  ];

  secondaryTabHeaders: TabHeaderElement[] = [
    {name: 'info', label: 'INFO'},
    {name: 'notes', label: 'NOTES'}
  ];

  selectedIndex: number = 0;
  selectedSecondaryIndex: number = 0;

  @ViewChild('customernotes') customerNotesComponent: CustomerInfoNotesComponent;

  infoVisible: boolean = true;

  customerId: string;
  sessionId: string;
  orderId: string;

  session: Session;
  customer: Customer;
  rebills: Rebill[];
  orders: Order[];
  selectedOrder: Order;
  transactions: Transaction[];
  shippingReceipts: ShippingReceipt[];

  detailsElement: ElementRef;

  productSchedulesWaitingForUpdate: ProductSchedule[];
  autosaveDebouncer: number = 3500;
  saveDebouncer: Subject<ProductSchedule[]> = new Subject();

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(
    private rebillService: RebillsService,
    private orderService: OrdersService,
    private customerService: CustomersService,
    public sessionService: SessionsService,
    private transactionService: TransactionsService,
    private shippingReceiptsService: ShippingReceiptsService,
    private route: ActivatedRoute,
    public navigation: NavigationService,
    private dialog: MatDialog,
    private router: Router
  ) {

    this.route.queryParams.takeUntil(this.unsubscribe$).subscribe((params: Params) => {
      this.sessionId = !!params['session'] ? params['session'] : null;
      this.customerId = !!params['customer'] ? params['customer'] : null;
      this.orderId = !!params['order'] ? params['order'] : null;

      this.init();
    })
  }

  ngOnInit() {
    this.saveDebouncer.debounceTime(this.autosaveDebouncer).takeUntil(this.unsubscribe$).subscribe(productSchedules => {
      this.sessionService.updateEntity(this.session.copyWithWatermark(productSchedules, this.session.watermark.extractedProducts), {ignoreSnack: true});
    });

    this.customerService.entity$.takeUntil(this.unsubscribe$).subscribe(customer => {
      if (customer instanceof CustomServerError) return;

      this.breadcrumbs = [
        {label: () => 'Customers', url: '/customers/advanced?customer=' + customer.id},
        {label: () => `${customer.firstName} ${customer.lastName}`}
      ];
      this.customer = customer;
    });

    this.sessionService.entity$.merge(this.sessionService.entityUpdated$).takeUntil(this.unsubscribe$).subscribe(session => {
      if (session instanceof CustomServerError) return;

      this.productSchedulesWaitingForUpdate = null;

      this.session = session;

      this.tabHeaders = [
        {name: 'subscriptions', label: 'SUBSCRIPTIONS'},
        {name: 'orders', label: 'ORDERS'},
        {name: 'transactions', label: 'TRANSACTIONS'},
        {name: 'fulfillment', label: 'FULFILLMENT'},
        {name: 'activity', label: 'ACTIVITY'},
        {name: 'watermark', label: 'WATERMARK'}
      ];

      this.route.fragment.take(1).subscribe(frag => {
        if (frag === 'watermark') {
          this.setIndex(5);
        }
      });

      this.breadcrumbs = [
        {label: () => 'Customers', url: '/customers'},
        {label: () => `${session.customer.firstName} ${session.customer.lastName}`, url: '/customers/advanced?customer=' + session.customer.id},
        {label: () => 'Session'},
        {label: () => session.alias, url: '/customers/advanced?session=' + session.id}
      ];

      this.customer = session.customer;
      this.rebills = session.rebills.filter(rebill => rebill.billAt.isAfter(utc()));
      this.transactions = session.rebills
        .map(rebill => {
          if (!rebill.transactions) return [];

          return rebill.transactions.map(transaction => {
            transaction.rebill = new Rebill({id: rebill.id});

            return transaction;
          });
        })
        .reduce((a,b) => a.concat(b), [])
        .map(transaction => {
          transaction.rebill.parentSession = new Session({id: session.id, alias: session.alias});

          return transaction;
        });
      this.shippingReceipts = this.transactions
        .map(transaction => transaction.products)
        .reduce((a,b) => a.concat(b), [])
        .map(products => products.shippingReceipt)
        .filter(receipt => !!receipt.id)
    });

  }

  init() {
    if (this.customerId === null && this.sessionId === null && this.orderId === null) return;

    this.orders = undefined;
    this.selectedOrder= undefined;
    this.transactions = undefined;
    this.shippingReceipts = undefined;
    this.rebills = undefined;
    this.session = undefined;

    if (this.orderId) {
      this.initOrder();
    } else if (this.sessionId) {
      this.initSession();
    } else {
      this.initCustomer();
    }
  }

  initCustomer() {
    this.tabHeaders = [
      {name: 'subscriptions', label: 'SUBSCRIPTIONS'},
      {name: 'orders', label: 'ORDERS'},
      {name: 'transactions', label: 'TRANSACTIONS'},
      {name: 'fulfillment', label: 'FULFILLMENT'},
      {name: 'activity', label: 'ACTIVITY'}
    ];

    if (this.selectedIndex === 5) {
      this.setIndex(0);
    }

    this.customerService.getEntity(this.customerId);

    this.rebillService.getPendingRebillsByCustomer(this.customerId, {}).subscribe(rebills => {
      this.rebills = rebills;
    });

    this.orderService.getOrdersByCustomer(this.customerId, {}).subscribe(orders => {
      this.orders = orders
    });

    this.shippingReceiptsService.getShippingReceiptsByCustomer(this.customerId, {}).subscribe(receipts => {
      this.shippingReceipts = receipts;
    });

    this.transactionService.getTransactionsByCustomer(this.customerId).subscribe(transactions => {
      this.transactions = transactions;
    })
  }

  initOrder() {
    this.rebillService.entity$.take(1).subscribe(rebill => {
      if (rebill instanceof CustomServerError) return;

      this.sessionId = rebill.parentSession.id;

      this.initSession(rebill);
    });

    this.rebillService.getEntity(this.orderId);
  }

  navigateToOrder(id: string) {
    this.orderId = id;
    const selectedOrder = firstIndexOf(this.orders, (order) => order.rebill.id === this.orderId);

    if (selectedOrder !== -1) {
      this.selectedOrder = this.orders[selectedOrder];
      this.router.navigate([], {fragment: 'orders', replaceUrl: true, queryParamsHandling: 'preserve'});

      return;
    }

    this.initOrder();
  }

  initSession(selectedOrder?: Rebill) {
    this.sessionService.getEntity(this.sessionId);
    this.orderService.getOrdersBySession(this.sessionId, {}).subscribe(orders => {
      this.orders = orders;

      if (selectedOrder) {

        if (selectedOrder.billAt.isAfter(utc())) {
          this.router.navigate([], {fragment: 'subscriptions', replaceUrl: true, queryParamsHandling: 'preserve'});
          return;
        }

        const index = firstIndexOf(this.orders, (order) => order.rebill.id === selectedOrder.id);

        if (index !== -1) {
          this.selectedOrder = this.orders[index];
          this.router.navigate([], {fragment: 'orders', replaceUrl: true, queryParamsHandling: 'preserve'});
        }

      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  setIndex(index: number) {
    this.selectedIndex = index;
  }

  setSecondaryIndex(index: number) {
    this.selectedSecondaryIndex = index;

    if (index === 1) {
      this.customerNotesComponent.scrollToBottom();
    }
  }

  refreshTransactions() {
    if (this.sessionId) {
      this.orderService.getOrdersBySession(this.sessionId, {}).subscribe(orders => {
        this.orders = orders;

        this.refreshSelectedOrder();
      });

      this.sessionService.getEntity(this.sessionId);
    } else {
      this.orderService.getOrdersByCustomer(this.customerId, {}).subscribe(orders => {
        this.orders = orders;

        this.refreshSelectedOrder();
      });

      this.transactionService.getTransactionsByCustomer(this.customerId).subscribe(transactions => {
        this.transactions = transactions;
      })
    }
  }

  refreshSelectedOrder() {
    if (this.selectedOrder && this.selectedOrder.id) {
      const index = firstIndexOf(this.orders, (order) => order.id === this.selectedOrder.id);

      if (index !== -1) {
        this.selectedOrder = this.orders[index];
      }
    }
  }

  canBeDeactivated() {
    return true;
  }

  updateItems(productSchedules: ProductSchedule[]) {
    if (productSchedules && productSchedules.length > 0) {
      this.productSchedulesWaitingForUpdate = productSchedules;
      this.saveDebouncer.next(productSchedules);
    }
  }

  setDetails(details) {
    this.detailsElement = details;
  }

  openCancelSessionModal() {
    let ref = this.dialog.open(YesNoDialogComponent);
    ref.componentInstance.text = 'Are you sure you want to cancel this session?';

    ref.afterClosed().subscribe(result => {
      ref = null;

      if (result && result.success) {
        this.cancelSession();
      }

    })
  }

  cancelSession() {
    this.sessionService.cancelSession(this.session).subscribe(session => {
      if (session instanceof CustomServerError) {
        return;
      }

      this.session = session;
      this.productSchedulesWaitingForUpdate = null;
    });
  }

  setSelectedOrder(order: Order) {
    this.selectedOrder = order ? order.copy() : null;
  }

  getTitle(): string {
    if (this.sessionId && this.session) return this.session.alias;

    if (this.customerId && this.customer) return `${this.customer.firstName} ${this.customer.lastName}`;

    return null;
  }
}
