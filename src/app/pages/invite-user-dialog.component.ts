import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {Role} from '../shared/models/role.model';

@Component({
  selector : 'associate-dialog',
  template : `
    <md-card>
      <md-card-content style="display: flex; flex-direction: column">
        <div>Invite new User</div>
        <md-input style="margin: 20px 0 0 0;" placeholder="User Email" [(ngModel)]="email"></md-input>
        <dropdown-component [mapper]="mapper" [options]="options" [selected]="role || {}" [placeholder]="'Role'" (onSelect)="role = $event"></dropdown-component>
      </md-card-content>
      <md-card-actions align="center">
        <button md-raised-button color="primary" (click)="invite()">Invite</button>
        <button md-raised-button color="primary" (click)="cancel()">Cancel</button>
      </md-card-actions>
    </md-card>
  `,
  styles : []
})
export class InviteUserDialogComponent {

  email: string;
  role: Role;
  options: Role[] = [];
  mapper = (el: Role) => el.name;

  constructor(public dialogRef: MdDialogRef<InviteUserDialogComponent>) {}

  ngOnInit() {}

  cancel(): void {
    this.dialogRef.close({email: null, role: null});
  }

  invite(): void {
    this.dialogRef.close({email: this.email, role: this.role});
  }

}
