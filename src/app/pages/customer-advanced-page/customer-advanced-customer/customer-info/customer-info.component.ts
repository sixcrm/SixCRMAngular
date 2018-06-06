import {Component, OnInit, Input} from '@angular/core';
import {CreditCard} from '../../../../shared/models/credit-card.model';
import {Customer} from '../../../../shared/models/customer.model';
import {MatDialog} from '@angular/material';
import {AddCustomerDialogComponent} from '../../../../dialog-modals/add-customer-dialog/add-customer-dialog.component';
import {CustomersService} from '../../../../shared/services/customers.service';

@Component({
  selector: 'customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})
export class CustomerInfoComponent implements OnInit {

  _customer: Customer;
  _defaultCreditCard: CreditCard;

  @Input() set customer(customer: Customer) {
    if (customer) {
      this._customer = customer.copy();
      this._defaultCreditCard = this.getDefaultCard();
    }
  };

  constructor(private dialog: MatDialog, private customerService: CustomersService) { }

  ngOnInit() {
  }

  getDefaultCard(): CreditCard {
    if (!this._customer) return null;

    for (let card of this._customer.creditCards) {
      if (card.id === this._customer.defaultCreditCard) {
        return card.copy();
      }
    }

    return null;
  }

  editCustomer() {
    let dialogRef = this.dialog.open(AddCustomerDialogComponent, {backdropClass: 'backdrop-blue'});

    dialogRef.componentInstance.customer = this._customer.copy();

    dialogRef.afterClosed().take(1).subscribe(result => {
      dialogRef = null;

      if (result.customer && result.customer.id) {
        this.customerService.updateEntity(result.customer);
      }
    })
  }

}
