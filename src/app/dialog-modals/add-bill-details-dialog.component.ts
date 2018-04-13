import {Component} from '@angular/core';
import {isAllowedCurrency} from '../shared/utils/form.utils';
import {Currency} from '../shared/utils/currency/currency';
import {MatDialogRef} from '@angular/material';

@Component({
  selector : 'add-bill-details-dialog',
  template : `
    <md-card>
      <md-card-content>
        <div style="margin-bottom: 10px;">{{'BILL_DETAILS_ADDITEM_TITLE' | translate}}</div>
        
        <div>
          <mat-input-container>
            <input matInput placeholder="{{'BILL_DETAILS_TABLE_DESCRIPTION' | translate}}" [(ngModel)]="description" type="text">
          </mat-input-container>
        </div>
        <div>
          <mat-input-container>
            <input matInput placeholder="{{'BILL_DETAILS_TABLE_AMOUNT' | translate}}" (keydown)="isCurrency($event)" type="text" currencyInput [initPrice]="amount" (priceChanged)="amount = $event">
          </mat-input-container>
        </div>
      </md-card-content>
      <md-card-actions class="custom-dialog__buttons">
        <div (click)="no()">{{'BILL_DETAILS_ADDITEM_CANCEL' | translate}}</div>
        <div (click)="yes()">{{'BILL_DETAILS_ADDITEM_SAVE' | translate}}</div>
      </md-card-actions>
    </md-card>
  `,
  styles : []
})
export class AddBillDetailsDialogComponent {

  description: string = '';
  amount: Currency = new Currency(0);
  isCurrency = isAllowedCurrency;

  constructor(public dialogRef: MatDialogRef<AddBillDetailsDialogComponent>) {}

  ngOnInit() { }

  no(): void {
    this.dialogRef.close({});
  }

  yes(): void {
    this.dialogRef.close({description: this.description, amount: this.amount});
  }

}
