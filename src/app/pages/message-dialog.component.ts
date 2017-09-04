import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector : 'message-dialog',
  template : `
    <md-card>
      <md-card-content>
        {{text}}
      </md-card-content>
      <md-card-actions align="center">
        <button md-raised-button color="primary" (click)="ok()">Ok</button>
      </md-card-actions>
    </md-card>
  `,
  styles : []
})
export class MessageDialogComponent {

  text: string = 'Are you sure?';

  constructor(public dialogRef: MdDialogRef<MessageDialogComponent>) {}

  ngOnInit() { }

  ok(): void {
    this.dialogRef.close();
  }

}
