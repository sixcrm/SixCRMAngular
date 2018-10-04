import {Component, OnInit, ViewChild} from '@angular/core';
import {AdvancedPaymentFormComponent} from '../../shared/components/advanced-payment-form/advanced-payment-form.component';
import {CreditCard} from '../../shared/models/credit-card.model';
import {MatDialogRef, MatDialog} from '@angular/material';
import {Rebill} from '../../shared/models/rebill.model';
import {TermsDialogComponent} from '../terms-dialog/terms-dialog.component';

@Component({
  selector: 'payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {

  @ViewChild(AdvancedPaymentFormComponent) paymentForm: AdvancedPaymentFormComponent;

  otherCreditCards: CreditCard[] = [];
  creditCard: CreditCard;
  rebill: Rebill;
  terms: {title: string, body: string, version: string};

  constructor(private dialogRef: MatDialogRef<PaymentDialogComponent>, private dialog: MatDialog) { }

  ngOnInit() {
  }

  submit(): void {
    if (this.creditCard && this.creditCard.id) {
      this.dialogRef.close({creditCard: this.creditCard});
    } else {
      const card = this.paymentForm.getValidCreditCard();

      if (!card) return;

      this.dialogRef.close({creditCard: card});
    }
  }

  close(): void {
    this.dialogRef.close({});
  }

  selectCard(card: CreditCard) {
    const temp = card.copy();
    temp.ccnumber = `**** ${temp.lastFour}`;
    temp.cvv = `***`;

    this.creditCard = temp;
  }

  pay() {
    if (this.creditCard && this.creditCard.id) {
      this.dialogRef.close({card: this.creditCard.copy()})
    } else {
      const card = this.paymentForm.getValidCreditCard();

      if (!card) return;

      this.dialogRef.close({card: card.copy()})
    }
  }

  openTerms() {
    if (!this.terms) return;

    let ref = this.dialog.open(TermsDialogComponent);
    ref.componentInstance.title = this.terms.title;
    ref.componentInstance.text = this.terms.body;

    ref.afterClosed().take(1).subscribe(() => {
      ref = null;
    });
  }

}
