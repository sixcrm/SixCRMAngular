import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector : 'associate-dialog',
  template : `
    <md-card>
      <md-card-content>
        {{text | translate}}
        <autocomplete-input [initialValue]="entity ? entity : ''" [options]="options" [placeholder]="placeholder | translate" [mapFunction]="mapper" (selected)="entity = $event"></autocomplete-input>
      </md-card-content>
      <md-card-actions class="custom-dialog__buttons">
        <div (click)="cancel()">{{associateCancelText | translate}}</div>
        <div (click)="associate()">{{associateButtonText | translate}}</div>
      </md-card-actions>
    </md-card>
  `,
  styles : []
})
export class AssociateDialogComponent<T> {

  text: string = 'ASSOCIATEDIALOG_TEXT';
  associateButtonText: string = 'ASSOCIATEDIALOG_ASSOCIATE';
  associateCancelText: string = 'ASSOCIATEDIALOG_CANCEL';
  placeholder: string = 'ASSOCIATEDIALOG_ENTITY';
  options: T[] = [];
  entity: T;
  mapper = el => el;

  constructor(public dialogRef: MdDialogRef<AssociateDialogComponent<T>>) {}

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close({entity : null});
  }

  associate(): void {
    this.dialogRef.close({entity : this.entity});
  }

}
