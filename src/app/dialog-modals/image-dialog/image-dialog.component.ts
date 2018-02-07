import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {SixImage} from '../../shared/models/six-image.model';

@Component({
  selector: 'image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {

  editMode: boolean;
  image: SixImage;

  constructor(public dialogRef: MdDialogRef<ImageDialogComponent>) {}

  ngOnInit() { }

  cancel(): void {
    this.dialogRef.close({});
  }

  save(): void {
    this.dialogRef.close({image: this.image.copy()});
  }

  close() {
    this.dialogRef.close({});
  }

}
