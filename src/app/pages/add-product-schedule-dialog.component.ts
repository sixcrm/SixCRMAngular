import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {Schedule} from '../shared/models/schedule.model';
import {ProductSchedule} from '../shared/models/product-schedule.model';

@Component({
  selector : 'add-product-schedule-dialog',
  template : `
    <add-schedule class="add-schedule--modal"
                  style="font-family: 'Roboto',serif"
                  (addProductSchedule)="addNewSchedule($event)"
                  (addSchedule)="addNewSchedule($event)"
                  [price]="price"
                  [productId]="productId"
                  [scheduleToAdd]="scheduleToAdd"
                  [productScheduleToAdd]="productScheduleToAdd"
                  (cancel)="cancel()"
                  [editMode]="editMode"
                  [addProductMode]="addProductMode">
    </add-schedule>
  `,
  styles : []
})
export class AddProductScheduleDialogComponent {

  price: string;
  productId: string;
  scheduleToAdd: Schedule = new Schedule();
  productScheduleToAdd: ProductSchedule = new ProductSchedule();
  addProductMode = false;
  editMode = false;

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
