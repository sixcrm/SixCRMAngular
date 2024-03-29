import {Component} from '@angular/core';
import {Role} from '../shared/models/role.model';
import {Account} from '../shared/models/account.model';
import {User} from '../shared/models/user.model';
import {MatDialogRef} from '@angular/material';

@Component({
  selector : 'add-user-acl-dialog',
  template : `
    <mat-card>
      <mat-card-content style="display: flex; flex-direction: column">
        <div style="margin-bottom: 25px;">{{text}}</div>
        <autocomplete-input *ngIf="accountView"
                            [disabled]="editMode"
                            [mapFunction]="userMapper"
                            [initialValue]="user"
                            [options]="users || []"
                            [placeholder]="'User'"
                            [required]="true"
                            (selected)="user = $event">
        </autocomplete-input>
        <autocomplete-input *ngIf="!accountView"
                            [disabled]="editMode"
                            [mapFunction]="accountMapper"
                            [initialValue]="account"
                            [options]="accounts || []"
                            [placeholder]="'Account'"
                            [required]="true"
                            (selected)="account = $event">
        </autocomplete-input>
        <dropdown-component [selected]="role"
                            [placeholder]="'Role'"
                            [options]="roles"
                            [mapper]="roleMapper"
                            (onSelect)="role = $event">
        </dropdown-component>

      </mat-card-content>
      <mat-card-actions class="custom-dialog__buttons">
        <div (click)="cancel()">CANCEL</div>
        <div (click)="add()">{{editMode ? 'EDIT' : 'ADD'}}</div>
      </mat-card-actions>
    </mat-card>
  `,
  styles : []
})
export class AddUserAclDialogComponent {

  text: string = 'Add User Acl';
  role: Role = new Role();
  account: Account = new Account();
  user: User = new User();
  roles: Role[] = [];
  accounts: Account[] = [];
  users: User[] = [];
  accountView: boolean = false;
  editMode: boolean = false;

  accountMapper = (account: Account) => account.name;
  roleMapper = (role: Role) => role.name;
  userMapper = (user: User) => user.name;

  constructor(public dialogRef: MatDialogRef<AddUserAclDialogComponent>) {}

  ngOnInit() {}

  cancel(): void {
    this.dialogRef.close({account: null, role: null});
  }

  add(): void {
    if ((!this.account.id && !this.user.id) || !this.role.id) return;

    this.dialogRef.close({user: this.user, account: this.account, role: this.role});
  }

}
