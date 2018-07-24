import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'tab-preferences-dialog',
  templateUrl: './tab-preferences-dialog.component.html',
  styleUrls: ['./tab-preferences-dialog.component.scss']
})
export class TabPreferencesDialogComponent implements OnInit {

  tabs: {label: string, visible: boolean}[] = [];

  constructor(private dialogRef: MatDialogRef<TabPreferencesDialogComponent>) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close(null);
  }

  done() {
    this.dialogRef.close({tabs: this.tabs});
  }

}
