import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {Role} from '../shared/models/role.model';
import {Account} from '../shared/models/account.model';

@Component({
  selector : 'add-user-acl-dialog',
  template : `
    <md-card>
      <md-card-content style="display: flex; flex-direction: column">
        <div style="margin-bottom: 25px;">Add User Acl</div>
        
        <autocomplete-input [mapFunction]="accountMapper"
                            [initialValue]="account"
                            [options]="accounts || []"
                            [placeholder]="'Account'"
                            [showCancelButton]="false"
                            [required]="true"
                            (selected)="account = $event">
        </autocomplete-input>
        
        <autocomplete-input [mapFunction]="roleMapper"
                            [initialValue]="role"
                            [options]="roles || []"
                            [placeholder]="'Role'"
                            [showCancelButton]="false"
                            [required]="true"
                            (selected)="role = $event">
        </autocomplete-input>
      </md-card-content>
      <md-card-actions align="center">
        <button md-raised-button color="primary" (click)="add()">Add</button>
        <button md-raised-button color="primary" (click)="cancel()">Cancel</button>
      </md-card-actions>
    </md-card>
  `,
  styles : []
})
export class AddUserAclDialogComponent {

  role: Role = new Role();
  account: Account = new Account();
  roles: Role[] = [];
  accounts: Account[] = [];

  accountMapper = (account: Account) => account.name;
  roleMapper = (role: Role) => role.name;

  constructor(public dialogRef: MdDialogRef<AddUserAclDialogComponent>) {}

  ngOnInit() {}

  cancel(): void {
    this.dialogRef.close({account: null, role: null});
  }

  add(): void {
    if (!this.account.id || !this.role.id) return;

    this.dialogRef.close({account: this.account, role: this.role});
  }

}
