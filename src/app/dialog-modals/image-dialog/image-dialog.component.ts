import { Component, OnInit } from '@angular/core';
import {SixImage} from '../../shared/models/six-image.model';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {

  image: SixImage;

  constructor(public dialogRef: MatDialogRef<ImageDialogComponent>) {}

  ngOnInit() { }

  close(): void {
    this.dialogRef.close({});
  }

}
