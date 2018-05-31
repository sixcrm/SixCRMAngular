import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'role-dialog',
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.scss']
})
export class RoleDialogComponent implements OnInit {

  name: string;
  description: string;

  formInvalid: boolean;

  constructor(private dialogRef: MatDialogRef<RoleDialogComponent>) { }

  ngOnInit() {
  }

  submit(): void {
    if (!this.name) {
      this.formInvalid = true;

      return;
    }

    this.dialogRef.close({name: this.name})
  }

  close(): void {
    this.dialogRef.close({});
  }
}
