import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'custom-token-block-dialog',
  templateUrl: './custom-token-block-dialog.component.html',
  styleUrls: ['./custom-token-block-dialog.component.scss']
})
export class CustomTokenBlockDialogComponent implements OnInit {

  title: string;

  constructor(public dialogRef: MatDialogRef<CustomTokenBlockDialogComponent>) {}

  ngOnInit() { }

  cancel(): void {
    this.dialogRef.close({title : null});
  }

  save(): void {
    this.dialogRef.close({title : this.title});
  }

}
