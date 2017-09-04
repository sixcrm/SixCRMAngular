import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector : 'add-product-schedule-dialog',
  template : `
    <add-schedule class="add-schedule--modal" style="font-family: 'Roboto',serif" (addProductSchedule)="addNewSchedule($event)" [price]="price" [productId]="productId" (cancel)="cancel()" [addProductMode]="false"></add-schedule>
  `,
  styles : []
})
export class AddProductScheduleDialogComponent {

  price: string;
  productId: string;

  constructor(public dialogRef: MdDialogRef<AddProductScheduleDialogComponent>) {}

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  addNewSchedule(schedule) {
    this.dialogRef.close(schedule);
  }

}
