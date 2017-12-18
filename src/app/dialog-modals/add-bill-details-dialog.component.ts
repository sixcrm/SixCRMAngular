import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {isAllowedCurrency} from '../shared/utils/form.utils';
import {getCurrencyMask} from '../shared/utils/mask.utils';

@Component({
  selector : 'add-bill-details-dialog',
  template : `
    <md-card>
      <md-card-content>
        <div style="margin-bottom: 10px;">{{'BILL_DETAILS_ADDITEM_TITLE' | translate}}</div>
        
        <div>
          <md-input-container>
            <input md-input placeholder="{{'BILL_DETAILS_TABLE_DESCRIPTION' | translate}}" [(ngModel)]="description" type="text">
          </md-input-container>
        </div>
        <div>
          <md-input-container>
            <input md-input placeholder="{{'BILL_DETAILS_TABLE_AMOUNT' | translate}}" [textMask]="{mask: numberMask, guide: false}" (keydown)="isCurrency($event)" [(ngModel)]="amount" type="text">
          </md-input-container>
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
  amount: string = '0';
  numberMask = getCurrencyMask();
  isCurrency = isAllowedCurrency;

  constructor(public dialogRef: MdDialogRef<AddBillDetailsDialogComponent>) {}

  ngOnInit() { }

  no(): void {
    this.dialogRef.close({});
  }

  yes(): void {
    this.dialogRef.close({description: this.description, amount: this.amount});
  }

}
