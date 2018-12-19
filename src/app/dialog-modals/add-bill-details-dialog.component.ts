import {Component} from '@angular/core';
import {Currency} from '../shared/utils/currency/currency';
import {MatDialogRef} from '@angular/material';

@Component({
  selector : 'add-bill-details-dialog',
  template : `
    <mat-card>
      <mat-card-content>
        <div style="margin-bottom: 10px;">{{'BILL_DETAILS_ADDITEM_TITLE' | translate}}</div>
        
        <div>
          <mat-form-field>
            <input matInput placeholder="{{'BILL_DETAILS_TABLE_DESCRIPTION' | translate}}" [(ngModel)]="description" type="text">
          </mat-form-field>
        </div>
        <div>
          <mat-form-field>
            <input matInput placeholder="{{'BILL_DETAILS_TABLE_AMOUNT' | translate}}" type="text" currencyInput [initPrice]="amount" (priceChanged)="amount = $event">
          </mat-form-field>
        </div>
      </mat-card-content>
      <mat-card-actions class="custom-dialog__buttons">
        <div (click)="no()">{{'BILL_DETAILS_ADDITEM_CANCEL' | translate}}</div>
        <div (click)="yes()">{{'BILL_DETAILS_ADDITEM_SAVE' | translate}}</div>
      </mat-card-actions>
    </mat-card>
  `,
  styles : []
})
export class AddBillDetailsDialogComponent {

  description: string = '';
  amount: Currency = new Currency(0);

  constructor(public dialogRef: MatDialogRef<AddBillDetailsDialogComponent>) {}

  ngOnInit() { }

  no(): void {
    this.dialogRef.close({});
  }

  yes(): void {
    this.dialogRef.close({description: this.description, amount: this.amount});
  }

}
