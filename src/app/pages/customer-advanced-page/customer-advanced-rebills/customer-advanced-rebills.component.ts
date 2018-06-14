import {Component, OnInit, Input} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {Customer} from '../../../shared/models/customer.model';
import {RebillsService} from '../../../shared/services/rebills.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router} from '@angular/router';
import {utc} from 'moment';
import {Return} from '../../../shared/models/return.model';

@Component({
  selector: 'customer-advanced-rebills',
  templateUrl: './customer-advanced-rebills.component.html',
  styleUrls: ['./customer-advanced-rebills.component.scss']
})
export class CustomerAdvancedRebillsComponent implements OnInit {

  _customer: Customer;

  rebills: Rebill[] = [];
  selectedRebill: Rebill;

  selectedIndex: number = 0;
  selectedGranularityIndex: number = 0;

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
  rowColorFunction = (e: Rebill) => e.hasChargeback() ? 'rgba(220, 37, 71, 0.05)' : '#ffffff';
  options: string[] = ['Refund', 'Return', 'Notify User', 'View Details'];

  constructor(
    private rebillService: RebillsService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('CUSTOMER_REBILL_STATE', (e: Rebill) => e.hasChargeback() ? 'Chargeback' : e.state)
        .setMaterialIconMapper((e: Rebill) => e.hasChargeback() ? 'error' : 'done')
        .setMaterialIconBackgroundColorMapper((e: Rebill) => e.hasChargeback() ? '#ffffff' : '#1EBEA5')
        .setMaterialIconColorMapper((e: Rebill) => e.hasChargeback() ? '#DC2547' : '#ffffff'),
      new ColumnParams('CUSTOMER_REBILL_AMOUNT', (e: Rebill) => e.amount.usd()),
      new ColumnParams('CUSTOMER_REBILL_REFUND', (e: Rebill) => '-').setAlign('center'),
      new ColumnParams('CUSTOMER_REBILL_CHARGEBACK', (e: Rebill) => '-').setAlign('center').setSeparator(true),
      new ColumnParams('CUSTOMER_REBILL_BILLED',(e: Rebill) => e.billAt.tz(f).format('MM/DD/YY')),
      new ColumnParams('CUSTOMER_REBILL_ORDER',(e: Rebill) => e.parentSession.alias).setClickable(true).setColor('#2C98F0'),
      new ColumnParams('CUSTOMER_REBILL_CAMPAIGN', (e: Rebill) => e.parentSession.campaign.name).setClickable(true).setColor('#2C98F0'),
      new ColumnParams('CUSTOMER_REBILL_TYPE', (e: Rebill) => '-').setAlign('center')
    ];

  }

  ngOnInit() { }

  initialize(): void {
    this.rebillService.getPastRebillsByCustomer(this._customer, {limit: 10}).subscribe(rebills => {
      this.rebills = rebills.map(r => {
        r.products = r.products.map(p => {
          // p.returns = [{quantity: 1, 'return': new Return({created_at: utc()})}];

          return p;
        });

        r.transactions = r.transactions.map(t => {
          // t.chargeback = true;
          // t.type = 'refund';

          return t;
        });

        return r;
      });
    });
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

  viewSingleRebill(rebill: Rebill) {
    this.selectedRebill = rebill.copy();

    this.selectedGranularityIndex = 1;
  }

  viewAllRebills() {
    this.selectedGranularityIndex = 0;
  }
}
