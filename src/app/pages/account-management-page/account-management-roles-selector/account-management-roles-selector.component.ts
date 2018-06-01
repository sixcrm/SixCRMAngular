import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Role} from '../../../shared/models/role.model';
import {Acl} from '../../../shared/models/acl.model';

@Component({
  selector: 'account-management-roles-selector',
  templateUrl: './account-management-roles-selector.component.html',
  styleUrls: ['./account-management-roles-selector.component.scss']
})
export class AccountManagementRolesSelectorComponent implements OnInit {

  @Input() roles: Role;
  @Input() sharedRoles: Role;
  @Input() acl: Acl;

  @Output() updateRole: EventEmitter<{acl: Acl, role: Role}> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  updateAclRole(acl: Acl, role: Role) {
    this.updateRole.emit({acl: acl, role: role});
  }
}
