import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector : 'single-input-dialog',
  template : `
    <mat-card>
      <mat-card-content>
        <div style="margin-bottom: 10px;">{{text | translate}}</div>
        <div style="margin-bottom: 10px;" *ngIf="secondaryText">{{secondaryText | translate}}</div>
        
        <mat-input-container>
          <input matInput (keydown)="keydownAllowFunction($event, inputContent)" placeholder="{{inputPlaceholder | translate}}" [(ngModel)]="inputContent" type="text">
        </mat-input-container>
        
      </mat-card-content>
      <mat-card-actions class="custom-dialog__buttons">
        <div (click)="no()">{{noText | translate}}</div>
        <div (click)="yes()">{{yesText | translate}}</div>
      </mat-card-actions>
    </mat-card>
  `,
  styles : []
})
export class SingleInputDialogComponent {

  text: string;
  secondaryText: string;
  inputPlaceholder: string;
  yesText: string = 'Yes';
  noText: string = 'No';
  keydownAllowFunction: (key, currentValue) => boolean = (key, currentValue) => true;

  inputContent: string;

  constructor(public dialogRef: MatDialogRef<SingleInputDialogComponent>) {}

  ngOnInit() { }

  no(): void {
    this.dialogRef.close({content : null});
  }

  yes(): void {
    this.dialogRef.close({content : this.inputContent});
  }

}
