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
      new ColumnParams('REBILL_SHIPPINGRECEIPT_STATUS', (e: ShippingReceipt) => e.status),
      new ColumnParams('REBILL_SHIPPINGRECEIPT_TRACKINGNUMBER',(e: ShippingReceipt) => e.trackingNumber).setCopyOption(true),
      new ColumnParams('REBILL_SHIPPINGRECEIPT_CREATED', (e: ShippingReceipt) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('REBILL_SHIPPINGRECEIPT_UPDATED', (e: ShippingReceipt) => e.updatedAt.tz(f).format('MM/DD/YYYY'))
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

  setIndex(index: number): void {
    this.selectedIndex = index;
  }

  ngOnDestroy() {
    this.destroy();
  }
}
