import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector : 'message-dialog',
  template : `
    <md-card>
      <md-card-content>
        {{text | translate}}
      </md-card-content>
      <md-card-actions class="custom-dialog__buttons">
        <div (click)="ok()">{{button | translate}}</div>
      </md-card-actions>
    </md-card>
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
