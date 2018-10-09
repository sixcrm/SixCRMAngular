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
import {firstIndexOf, sortByCreatedAtFn} from '../../shared/utils/array.utils';

@Component({
  selector: 'customer-advanced',
  templateUrl: './customer-advanced.component.html',
  styleUrls: ['./customer-advanced.component.scss']
})
export class CustomerAdvancedComponent implements OnInit, OnDestroy {

  @ViewChild('customernotes') customerNotesComponent: CustomerInfoNotesComponent;

  breadcrumbs: BreadcrumbItem[] = [];

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

  infoVisible: boolean = true;

  customerId: string;
  sessionId: string;
  orderId: string;
  transactionId: string;

  session: Session;
  customer: Customer;
  rebills: Rebill[];
  orders: Order[];
  selectedOrder: Order;
  transactions: Transaction[];
  selectedTransaction: Transaction;
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
  ) { }

  ngOnInit() {
    this.route.queryParams.takeUntil(this.unsubscribe$).subscribe((params: Params) => {
      this.sessionId = !!params['session'] ? params['session'] : null;
      this.customerId = !!params['customer'] ? params['customer'] : null;
      this.orderId = !!params['order'] ? params['order'] : null;
      this.transactionId = !!params['transaction'] ? params['transaction'] : null;

      this.init();
    });

    this.saveDebouncer.debounceTime(this.autosaveDebouncer).takeUntil(this.unsubscribe$).subscribe(productSchedules => {
      this.sessionService.updateEntity(this.session.copyWithWatermark(productSchedules, this.session.watermark.extractedProducts), {ignoreSnack: true});
    });

    this.customerService.entityUpdated$.takeUntil(this.unsubscribe$).subscribe(customer => {
      if (customer instanceof CustomServerError) return;

      this.customer = customer;
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
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
        this.orders = this.filterOrders(orders);

        this.refreshSelectedOrder();
      });

      this.sessionService.getEntity(this.sessionId);
    } else {
      this.orderService.getOrdersByCustomer(this.customerId, {}).subscribe(orders => {
        this.orders = this.filterOrders(orders);

        this.refreshSelectedOrder();
      });

      this.transactionService.getTransactionsByCustomer(this.customerId).subscribe(transactions => {
        this.transactions = transactions;
      })
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
    if (this.selectedTransaction) return `Transaction – ${this.selectedTransaction.alias}`;

    if (this.sessionId && this.session) return `Session – ${this.session.alias}`;

    if (this.customerId && this.customer) return `${this.customer.firstName} ${this.customer.lastName}`;

    return null;
  }

  private init() {
    if (this.customerId === null
      && this.sessionId === null
      && this.orderId === null
      && this.transactions === null
    ) {
      return;
    }

    this.breadcrumbs = [];

    this.orders = undefined;
    this.selectedOrder= undefined;
    this.transactions = undefined;
    this.selectedTransaction = undefined;
    this.shippingReceipts = undefined;
    this.rebills = undefined;
    this.session = undefined;

    if (this.customerId) {
      this.initCustomer();
    } else if (this.sessionId) {
      this.initSession();
    } else if (this.orderId) {
      this.initOrder();
    } else {
      this.initTransaction();
    }
  }

  private initCustomer() {
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

    this.customerService.entity$.takeUntil(this.unsubscribe$).subscribe(customer => {
      if (customer instanceof CustomServerError) return;

      this.breadcrumbs = [
        {label: () => `Customer`},
        {label: () => ''}
      ];

      this.customer = customer;
    });

    this.customerService.getEntity(this.customerId);

    this.rebillService.getPendingRebillsByCustomer(this.customerId, {}).subscribe(rebills => {
      this.rebills = rebills.sort(sortByCreatedAtFn('desc'));
    });

    this.orderService.getOrdersByCustomer(this.customerId, {}).subscribe(orders => {
      this.orders = this.filterOrders(orders);
    });

    this.shippingReceiptsService.getShippingReceiptsByCustomer(this.customerId, {}).subscribe(receipts => {
      this.shippingReceipts = receipts.sort(sortByCreatedAtFn('desc'));
    });

    this.transactionService.getTransactionsByCustomer(this.customerId).subscribe(transactions => {
      this.transactions = transactions.sort(sortByCreatedAtFn('desc'));
    })
  }

  private initSession(session?: Session, selectedOrder?: Rebill) {

    this.sessionService
      .entity$
      .merge(this.sessionService.entityUpdated$)
      .takeUntil(this.unsubscribe$)
      .subscribe(session => {
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
          {label: () => `${session.customer.firstName} ${session.customer.lastName}`, url: '/customers/advanced?customer=' + session.customer.id},
          {label: () => ''},
        ];

        this.customer = session.customer;
        this.rebills = session.rebills
          .filter(rebill => rebill.billAt.isAfter(utc()))
          .map(rebill => {
            rebill.parentSession.campaign = this.session.campaign.inverse();

            return rebill;
          })
          .sort(sortByCreatedAtFn('desc'));

        this.transactions = session.rebills
          .map(rebill => {
            if (!rebill.transactions) return [];

            return rebill.transactions.map(transaction => {
              transaction.rebill = new Rebill({id: rebill.id, alias: rebill.alias});

              return transaction;
            });
          })
          .reduce((a,b) => a.concat(b), [])
          .map(transaction => {
            transaction.rebill.parentSession = new Session({id: session.id, alias: session.alias});

            return transaction;
          })
          .sort(sortByCreatedAtFn('desc'));

        this.shippingReceipts = this.transactions
          .map(transaction =>
            transaction.products.map(p => {
              p.rebill = new Rebill({id: transaction.rebill.id, alias: transaction.rebill.alias});

              return p;
            })
          )
          .reduce((a,b) => a.concat(b), [])
          .map(products => {
            const receipt = products.shippingReceipt;
            receipt.rebill = products.rebill;

            return receipt;
          })
          .filter(receipt => !!receipt.id)
          .reduce((a,b) => a.some(el => el.id === b.id) ? a : [...a,b], [])
          .sort(sortByCreatedAtFn('desc'));
      });

    if (session && session.id) {
      this.sessionId = session.id;
      this.sessionService.entity$.next(session);
    } else {
      this.sessionService.getEntity(this.sessionId);
    }

    this.orderService.getOrdersBySession(this.sessionId, {}).subscribe(orders => {
      this.orders = this.filterOrders(orders);

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

  private initOrder() {
    this.rebillService.entity$.take(1).subscribe(rebill => {
      if (rebill instanceof CustomServerError) return;

      this.sessionId = rebill.parentSession.id;

      this.initSession(rebill.parentSession, rebill);
    });

    this.rebillService.getRebillWithFullSessionDetails(this.orderId);
  }

  private initTransaction() {
    this.transactionService.entity$.take(1).subscribe(transaction => {
      if (transaction instanceof CustomServerError) return;

      this.selectedTransaction = transaction;
      this.customer = this.selectedTransaction.rebill.parentSession.customer;

      this.breadcrumbs = [
        {label: () => `${this.customer.firstName} ${this.customer.lastName}`, url: '/customers/advanced?customer=' + this.customer.id},
        {label: () => `Session – ${this.selectedTransaction.rebill.parentSession.alias}`, url: '/customers/advanced?session=' + this.selectedTransaction.rebill.parentSession.id},
        {label: () => ''},
      ];
    });

    this.transactionService.getTransactionWithSessionDetails(this.transactionId);
  }

  private filterOrders(orders: Order[]): Order[] {
    if (!orders || orders.length === 0) return [];

    return orders
      .filter(o => o.rebill && o.rebill.billAt && o.rebill.billAt.isSameOrBefore(utc()))
      .sort((a,b) => a.date.isBefore(b.date) ? 1 : a.date.isAfter(b.date) ? -1 : 0);
  }

  private refreshSelectedOrder() {
    if (this.selectedOrder && this.selectedOrder.id) {
      const index = firstIndexOf(this.orders, (order) => order.id === this.selectedOrder.id);

      if (index !== -1) {
        this.selectedOrder = this.orders[index];
      }
    }
  }

}
