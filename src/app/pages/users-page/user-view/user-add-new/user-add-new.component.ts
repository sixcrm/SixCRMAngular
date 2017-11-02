import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {User} from '../../../../shared/models/user.model';
import {Account} from '../../../../shared/models/account.model';
import {Role} from '../../../../shared/models/role.model';
import {Modes} from '../../../abstract-entity-view.component';
import {isAllowedEmail} from '../../../../shared/utils/form.utils';

@Component({
  selector: 'user-add-new',
  templateUrl: './user-add-new.component.html',
  styleUrls: ['./user-add-new.component.scss']
})
export class UserAddNewComponent implements OnInit {

  @Input() entity: User;
  @Input() mode: Modes;
  @Input() editEnabled: boolean = true;
  @Input() accounts: Account[] = [];
  @Input() roles: Role[] = [];

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<{user: User, accountToAdd: Account, roleToAdd: Role}> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;
  isEmail = isAllowedEmail;

  newAccount: boolean = true;

  accountToAdd: Account = new Account();
  roleToAdd: Role = new Role();

  accountsMapFunction = (account: Account) => account.name;
  rolesMapFunction = (role: Role) => role.name;

  constructor() { }

  ngOnInit() { }

  saveUser(valid: boolean): void {
    this.formInvalid = !valid || (!this.newAccount && !this.roleToAdd.id && !this.accountToAdd.id);

    if (this.formInvalid) return;

    const account = this.newAccount ? null : this.accountToAdd;
    const role = this.newAccount ? null : this.roleToAdd;

    this.save.emit({user: this.entity, accountToAdd: account, roleToAdd: role});
  }

}
