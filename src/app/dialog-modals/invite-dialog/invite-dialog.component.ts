import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Role} from '../../shared/models/role.model';

@Component({
  selector: 'invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrls: ['./invite-dialog.component.scss']
})
export class InviteDialogComponent implements OnInit {

  sharedRoles: Role[] = [];
  roles: Role[] = [];

  email: string;
  selectedRole: Role = new Role();
  firstName: string;
  lastName: string;

  formInvalid: boolean;

  constructor(private dialogRef: MatDialogRef<InviteDialogComponent>) { }

  ngOnInit() {
  }

  submit(): void {
    if (!this.email || !this.selectedRole || !this.selectedRole.id) {
      this.formInvalid = true;

      return;
    }

    this.dialogRef.close({email: this.email, role: this.selectedRole})
  }

  close(): void {
    this.dialogRef.close({});
  }

  setRole(role: Role) {
    this.selectedRole = role;
  }

}
