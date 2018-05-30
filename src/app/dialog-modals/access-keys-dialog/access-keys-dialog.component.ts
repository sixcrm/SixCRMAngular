import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'access-keys-dialog',
  templateUrl: './access-keys-dialog.component.html',
  styleUrls: ['./access-keys-dialog.component.scss']
})
export class AccessKeysDialogComponent implements OnInit {

  editMode: boolean;
  name: string = '';
  notes: string = '';

  constructor(private dialogRef: MatDialogRef<AccessKeysDialogComponent>) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

  save() {
    this.dialogRef.close({name: this.name, notes: this.notes})
  }
}
