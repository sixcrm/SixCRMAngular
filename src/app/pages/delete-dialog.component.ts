import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

/*

 Dialogs currently DO NOT WORK when declared (inside the "declarations" array of the NgModule) inside a lazy loaded ngModule.
 To fix this, just put all dialog components inside your main AppModule
 You will also NEED to add the dialog to the "entryComponents" array inside the ngModule as well!

 */
@Component({
  selector : 'delete-dialog',
  template : `
    <md-card>
      <md-card-content>
        {{text}}
      </md-card-content>
      <md-card-actions class="custom-dialog__buttons">
        <div (click)="no()">NO</div>
        <div (click)="yes()">YES</div>
      </md-card-actions>
    </md-card>
  `,
  styles : []
})
export class DeleteDialogComponent {

  text: string = 'Are you sure you want to delete?';

  constructor(public dialogRef: MdDialogRef<DeleteDialogComponent>) {}

  ngOnInit() {
  }

  no(): void {
    this.dialogRef.close({success : false});
  }

  yes(): void {
    this.dialogRef.close({success : true});
  }

}
