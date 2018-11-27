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
    <mat-card>
      <mat-card-content>
        {{text | translate}}
      </mat-card-content>
      <mat-card-actions class="custom-dialog__buttons">
        <div (click)="no()">{{'DELETEDIALOG_CANCEL' | translate}}</div>
        <div (click)="yes()">{{'DELETEDIALOG_DEL' | translate}}</div>
      </mat-card-actions>
    </mat-card>
  `,
  styles : []
})
export class DeleteDialogComponent {

  text: string = 'DELETEDIALOG_TEXT';

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
