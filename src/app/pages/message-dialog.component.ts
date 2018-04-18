import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector : 'message-dialog',
  template : `
    <mat-card>
      <mat-card-content>
        {{text | translate}}
      </mat-card-content>
      <mat-card-actions class="custom-dialog__buttons">
        <div (click)="ok()">{{button | translate}}</div>
      </mat-card-actions>
    </mat-card>
  `,
  styles : []
})
export class MessageDialogComponent {

  text: string = 'MESSAGEDIALOG_TITLE';
  button: string = 'MESSAGEDIALOG_BUTTON';

  constructor(public dialogRef: MatDialogRef<MessageDialogComponent>) {}

  ngOnInit() { }

  ok(): void {
    this.dialogRef.close();
  }

}
