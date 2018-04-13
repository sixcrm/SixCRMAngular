import {Component} from '@angular/core';
import {Role} from '../shared/models/role.model';
import {isAllowedEmail} from '../shared/utils/form.utils';
import {MatDialogRef} from '@angular/material';

@Component({
  selector : 'invite-user-dialog',
  template : `
    <mat-card>
      <mat-card-content style="display: flex; flex-direction: column">
        <div>{{'INVITEUSER_TITLE' | translate}}</div>
        <mat-input-container style="margin: 20px 0 0 0;">
          <input matInput (keydown)="isEmail($event, email)" placeholder="{{'INVITEUSER_EMAIL' | translate}}" [(ngModel)]="email">
        </mat-input-container>
        <dropdown-component [mapper]="mapper" [options]="options" [selected]="role || {}" [placeholder]="'INVITEUSER_ROLE' | translate" (onSelect)="role = $event"></dropdown-component>
      </mat-card-content>
      <mat-card-actions class="custom-dialog__buttons">
        <div (click)="cancel()">{{'INVITEUSER_CANCEL' | translate}}</div>
        <div (click)="invite()">{{'INVITEUSER_INVITE' | translate}}</div>
      </mat-card-actions>
    </mat-card>
  `,
  styles : []
})
export class InviteUserDialogComponent {

  email: string;
  role: Role;
  options: Role[] = [];
  mapper = (el: Role) => el.name;
  isEmail = isAllowedEmail;

  constructor(public dialogRef: MatDialogRef<InviteUserDialogComponent>) {}

  ngOnInit() {}

  cancel(): void {
    this.dialogRef.close({email: null, role: null});
  }

  invite(): void {
    this.dialogRef.close({email: this.email, role: this.role});
  }

}
