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

  isOnlyOneSelected(param: {label: string, selected: boolean}) {
    const selected = (this.columnParams || []).filter(p => p.selected);

    if (selected.length !== 1) return false;

    return selected[0].label === param.label;
  }
}
