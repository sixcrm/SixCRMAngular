import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'terms-dialog',
  templateUrl: './terms-dialog.component.html',
  styleUrls: ['./terms-dialog.component.scss']
})
export class TermsDialogComponent implements OnInit {

  title: string;
  text: string;

  constructor(public dialogRef: MatDialogRef<TermsDialogComponent>) {}

  ngOnInit() { }

  close(): void {
    this.dialogRef.close({});
  }
}
