import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {CreditCard} from '../../shared/models/credit-card.model';
import {getCountries, getStates} from '../../shared/utils/address.utils';
import {
  isValidZip, isAllowedZip, isValidCity, isValidAddress, isValidCountry, isValidState, isAllowedNumeric
} from '../../shared/utils/form.utils';
import {utc} from 'moment';
import {AdvancedPaymentFormComponent} from '../../shared/components/advanced-payment-form/advanced-payment-form.component';

@Component({
  selector: 'add-credit-card-dialog',
  templateUrl: './add-credit-card-dialog.component.html',
  styleUrls: ['./add-credit-card-dialog.component.scss']
})
export class AddCreditCardDialogComponent implements OnInit {

  @ViewChild(AdvancedPaymentFormComponent) paymentForm: AdvancedPaymentFormComponent;

  creditCard: CreditCard;
  isDefaultCreditCard: boolean;
  hideDefaultCardSelection: boolean;

  constructor(private dialogRef: MatDialogRef<AddCreditCardDialogComponent>) { }

  ngOnInit() {
  }

  submit(): void {
    const card = this.paymentForm.getValidCreditCard();

    if (!card) return;

    this.dialogRef.close({creditCard: card, isDefaultCard: this.isDefaultCreditCard});
  }

  close(): void {
    this.dialogRef.close({});
  }

}
