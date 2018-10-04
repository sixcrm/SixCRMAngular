import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {CreditCard} from '../../shared/models/credit-card.model';
import {PaymentFormComponent} from '../../shared/components/payment-form/payment-form.component';

@Component({
  selector: 'add-credit-card-dialog',
  templateUrl: './add-credit-card-dialog.component.html',
  styleUrls: ['./add-credit-card-dialog.component.scss']
})
export class AddCreditCardDialogComponent implements OnInit {

  @ViewChild(PaymentFormComponent) paymentForm: PaymentFormComponent;

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
