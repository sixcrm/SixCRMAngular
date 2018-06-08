import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Role} from '../../../shared/models/role.model';
import {Acl} from '../../../shared/models/acl.model';
import {AuthenticationService} from '../../../authentication/authentication.service';

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

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
  }

  updateAclRole(acl: Acl, role: Role) {
    this.updateRole.emit({acl: acl, role: role});
  }

  canChange(): boolean {
    if (!this.acl) return false;

    if (this.acl.role.isOwner()) return false;

    if (this.acl.id === this.authService.getActiveAcl().id) return false;

    return true;
  }
}
