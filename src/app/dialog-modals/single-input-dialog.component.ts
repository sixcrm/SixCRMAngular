import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector : 'single-input-dialog',
  template : `
    <md-card>
      <md-card-content>
        <div style="margin-bottom: 10px;">{{text | translate}}</div>
        <div style="margin-bottom: 10px;" *ngIf="secondaryText">{{secondaryText | translate}}</div>
        
        <md-input-container>
          <input md-input (keydown)="keydownAllowFunction($event, inputContent)" placeholder="{{inputPlaceholder | translate}}" [(ngModel)]="inputContent" type="text">
        </md-input-container>
        
      </md-card-content>
      <md-card-actions class="custom-dialog__buttons">
        <div (click)="no()">{{noText | translate}}</div>
        <div (click)="yes()">{{yesText | translate}}</div>
      </md-card-actions>
    </md-card>
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
