import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector : 'associate-dialog',
  template : `
    <md-card>
      <md-card-content>
        {{text}}
        <autocomplete-input [initialValue]="entity ? entity : ''" [options]="options" [placeholder]="placeholder" [mapFunction]="mapper" (selected)="entity = $event"></autocomplete-input>
      </md-card-content>
      <md-card-actions align="center">
        <button md-raised-button color="primary" (click)="associate()">{{associateButtonText}}</button>
        <button autoFocus md-raised-button color="primary" (click)="cancel()">Cancel</button>
      </md-card-actions>
    </md-card>
  `,
  styles : []
})
export class AssociateDialogComponent<T> {

  text: string = 'Select entity to associate';
  associateButtonText: string = 'Associate';
  placeholder: string = 'Entity';
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
