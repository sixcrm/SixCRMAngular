import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

/*

 Dialogs currently DO NOT WORK when declared (inside the "declarations" array of the NgModule) inside a lazy loaded ngModule.
 To fix this, just put all dialog components inside your main AppModule
 You will also NEED to add the dialog to the "entryComponents" array inside the ngModule as well!

 */
@Component({
  selector : 'associate-dialog',
  template : `
    <md-card>
      <md-card-content>
        {{text}}
        <dropdown-component class="associate__dropdown" [showFloatingPlaceholder]="false" [mapper]="mapper" [options]="options" [selected]="entity || {}" [placeholder]="placeholder" (onSelect)="entity = $event"></dropdown-component>
      </md-card-content>
      <md-card-actions align="center">
        <button md-raised-button color="primary" (click)="associate()">Associate</button>
        <button md-raised-button color="primary" (click)="cancel()">Cancel</button>
      </md-card-actions>
    </md-card>
  `,
  styles : []
})
export class AssociateDialogComponent<T> {

  text: string = 'Select entity to associate';
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
