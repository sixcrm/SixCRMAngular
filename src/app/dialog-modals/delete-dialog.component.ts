import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

/*

 Dialogs currently DO NOT WORK when declared (inside the "declarations" array of the NgModule) inside a lazy loaded ngModule.
 To fix this, just put all dialog components inside your main AppModule
 You will also NEED to add the dialog to the "entryComponents" array inside the ngModule as well!

 */
@Component({
  selector : 'delete-dialog',
  template : `
    <div class="delete-dialog-container">
      <div>
        <div class="text">{{text}}</div>
        <div class="secondary">{{secondaryText}}</div>
        <div class="items-list">
            <div *ngFor="let item of items">
                {{item}}
            </div>
        </div>
      </div>
      <div class="buttons">
        <button mat-button (click)="no()">No</button>
        <button mat-button (click)="yes()">Yes</button>
      </div>
    </div>
  `,
  styles : []
})
export class DeleteDialogComponent {

  text: string = 'Delete Confirmation';
  secondaryText: string = 'Deleting is permanent and irreversible. Are you sure you want to proceed?';
  items: string[] = [];

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>) {}

  ngOnInit() {
  }

  no(): void {
    this.dialogRef.close({success : false});
  }

  yes(): void {
    this.dialogRef.close({success : true});
  }

}
