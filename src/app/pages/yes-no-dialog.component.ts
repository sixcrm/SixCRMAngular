import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector : 'yes-no-dialog',
  template : `
    <md-card>
      <md-card-content>
        <div class="yes-no-dialog__primary">{{text | translate}}</div>
        <div *ngIf="secondaryText" class="yes-no-dialog__secondary">{{secondaryText | translate}}</div>
      </md-card-content>
      <md-card-actions class="custom-dialog__buttons">
        <div (click)="no()">{{noText | translate}}</div>
        <div (click)="yes()">{{yesText | translate}}</div>
      </md-card-actions>
    </md-card>
  `,
  styles : []
})
export class YesNoDialogComponent {

  text: string = 'Are you sure?';
  secondaryText: string;
  yesText: string = 'Yes';
  noText: string = 'No';

  constructor(public dialogRef: MdDialogRef<YesNoDialogComponent>) {}

  ngOnInit() { }

  no(): void {
    this.dialogRef.close({success : false});
  }

  yes(): void {
    this.dialogRef.close({success : true});
  }

}
