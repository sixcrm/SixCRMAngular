import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'column-preferences-dialog',
  templateUrl: './column-preferences-dialog.component.html',
  styleUrls: ['./column-preferences-dialog.component.scss']
})
export class ColumnPreferencesDialogComponent implements OnInit {

  columnParams: {label: string, selected: boolean}[] = [];

  constructor(private dialogRef: MatDialogRef<ColumnPreferencesDialogComponent>) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close(null);
  }

  done() {
    this.dialogRef.close({params: this.columnParams});
  }
}
