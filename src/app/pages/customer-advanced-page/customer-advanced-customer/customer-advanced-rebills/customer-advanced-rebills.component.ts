import {Component, OnInit, Input} from '@angular/core';
import {Rebill} from '../../../../shared/models/rebill.model';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {Customer} from '../../../../shared/models/customer.model';
import {RebillsService} from '../../../../shared/services/rebills.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {Router} from '@angular/router';
import {rebillsListQuery, rebillsByCustomer} from '../../../../shared/utils/queries/entities/rebill.queries';
import {IndexQueryParameters} from '../../../../shared/utils/queries/index-query-parameters.model';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {utc} from 'moment';

@Component({
  selector: 'customer-advanced-rebills',
  templateUrl: './customer-advanced-rebills.component.html',
  styleUrls: ['./customer-advanced-rebills.component.scss']
})
export class CustomerAdvancedRebillsComponent implements OnInit {

  _customer: Customer;

  rebills: Rebill[] = [];

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
  options: string[] = ['Cancel Order', 'Edit Order', 'Notify User', 'View Details'];
  bulkOptions: string[] = ['Cancel', 'Refund'];

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

      this.rebills = rebills;
    });

    this.rebillService.getEntities();
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

}
