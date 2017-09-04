import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector : 'yes-no-dialog',
  template : `
    <md-card>
      <md-card-content>
        {{text}}
      </md-card-content>
      <md-card-actions align="center">
        <button md-raised-button color="primary" (click)="yes()">Yes</button>
        <button md-raised-button color="primary" (click)="no()">No</button>
      </md-card-actions>
    </md-card>
  `,
  styles : []
})
export class YesNoDialogComponent {

  text: string = 'Are you sure?';

  constructor(public dialogRef: MdDialogRef<YesNoDialogComponent>) {}

  ngOnInit() { }

  no(): void {
    this.dialogRef.close({success : false});
  }

  yes(): void {
    this.dialogRef.close({success : true});
  }

}
