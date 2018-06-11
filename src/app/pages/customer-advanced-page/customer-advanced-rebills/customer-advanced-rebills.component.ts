import {Component, OnInit, Input} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {Customer} from '../../../shared/models/customer.model';
import {RebillsService} from '../../../shared/services/rebills.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router} from '@angular/router';
import {rebillsListQuery, rebillsByCustomer} from '../../../shared/utils/queries/entities/rebill.queries';
import {IndexQueryParameters} from '../../../shared/utils/queries/index-query-parameters.model';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {utc} from 'moment';
import {Products} from '../../../shared/models/products.model';
import {ShippingReceipt} from '../../../shared/models/shipping-receipt.model';

@Component({
  selector: 'customer-advanced-rebills',
  templateUrl: './customer-advanced-rebills.component.html',
  styleUrls: ['./customer-advanced-rebills.component.scss']
})
export class CustomerAdvancedRebillsComponent implements OnInit {

  _customer: Customer;

  rebills: Rebill[] = [];

  selectedIndex: number = 0;

  @Input() set customer(customer: Customer) {
    if (customer) {
      const performInit = !this._customer;

      this._customer = customer;

      if (performInit) {
        this.initialize();
      }
    }
  }

  lineBreakFunction = (previous: Rebill, current: Rebill) => {
    if (previous && previous.billAt.isAfter(utc()) && current.billAt.isBefore(utc())) {
      return `Today - ${utc().format('MMMM DD, YYYY')}`;
    }

    return null;
  };

  columnParams: ColumnParams<Rebill>[] = [];
  rowColorFunction = (e: Rebill) => e.billAt.isSameOrAfter(utc()) ? '#ffffff' : '#F2F2F2';
  options: string[] = ['Refund', 'Return', 'Notify User', 'View Details'];

  constructor(
    private rebillService: RebillsService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('CUSTOMER_REBILL_STATE', (e: Rebill) => e.state),
      new ColumnParams('CUSTOMER_REBILL_AMOUNT', (e: Rebill) => e.amount.usd()),
      new ColumnParams('CUSTOMER_REBILL_REFUND', (e: Rebill) => '-').setAlign('center'),
      new ColumnParams('CUSTOMER_REBILL_CHARGEBACK', (e: Rebill) => '-').setAlign('center').setSeparator(true),
      new ColumnParams('CUSTOMER_REBILL_BILLED',(e: Rebill) => e.billAt.tz(f).format('MM/DD/YY')),
      new ColumnParams('CUSTOMER_REBILL_ORDER',(e: Rebill) => e.parentSession.alias).setClickable(true).setColor('#2C98F0'),
      new ColumnParams('CUSTOMER_REBILL_CAMPAIGN', (e: Rebill) => e.parentSession.campaign.name).setClickable(true).setColor('#2C98F0'),
      new ColumnParams('CUSTOMER_REBILL_TYPE', (e: Rebill) => '-').setAlign('center')
    ];
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.rebillService.indexQuery = rebillsListQuery;
  }

  initialize() {
    this.rebillService.indexQuery = (params: IndexQueryParameters) => rebillsByCustomer(this._customer.id, params);

    this.rebillService.entities$.take(1).subscribe(rebills => {
      if (rebills instanceof CustomServerError) return;

      // const shippingReceipt = new ShippingReceipt({
      //   id:"d6c96609-1d51-4263-967e-96a5671c1304",status:"pending",tracking:null, history:[{created_at:"2018-05-11T18:37:04.281Z",status:"pending",detail:"Fulfillment Provider notified."}],created_at:"2018-05-30T18:37:04.287Z",updated_at:"2018-05-30T18:37:04.287Z"
      // });

      this.rebills = rebills.map(r => {
        // r.shippingReceipts = [shippingReceipt];

        return r;
      });

      this.rebills = rebills;
    });

    this.rebillService.getEntities(10);
  }

  itemClicked(option: {item: Rebill, param: ColumnParams<Rebill>}) {
    switch (option.param.label) {
      case ('CUSTOMER_REBILL_CAMPAIGN'): {
        this.router.navigate(['/campaigns', option.item.parentSession.campaign.id]);
        break
      }
      case ('CUSTOMER_REBILL_ORDER'): {
        this.router.navigate(['/sessions', option.item.parentSession.id]);
        break
      }
      default: {}
    }
  }

  setIndex(index: number) {
    this.selectedIndex = index;
  }
}
