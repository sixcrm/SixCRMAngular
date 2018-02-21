import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {SixImage} from '../../shared/models/six-image.model';

@Component({
  selector: 'image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {

  image: SixImage;

  constructor(public dialogRef: MdDialogRef<ImageDialogComponent>) {}

  ngOnInit() { }

  close(): void {
    this.dialogRef.close({});
  }

}
