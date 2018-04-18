import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector : 'yes-no-dialog',
  template : `
    <mat-card>
      <mat-card-content>
        <div class="yes-no-dialog__primary">{{text | translate}}</div>
        <div *ngIf="secondaryText" class="yes-no-dialog__secondary">{{secondaryText | translate}}</div>
      </mat-card-content>
      <mat-card-actions class="custom-dialog__buttons">
        <div (click)="no()">{{noText | translate}}</div>
        <div (click)="yes()">{{yesText | translate}}</div>
      </mat-card-actions>
    </mat-card>
  `,
  styles : []
})
export class YesNoDialogComponent {

  text: string = 'Are you sure?';
  secondaryText: string;
  yesText: string = 'Yes';
  noText: string = 'No';

  constructor(public dialogRef: MatDialogRef<YesNoDialogComponent>) {}

  ngOnInit() { }

  no(): void {
    this.dialogRef.close({success : false});
  }

  yes(): void {
    this.dialogRef.close({success : true});
  }

}
