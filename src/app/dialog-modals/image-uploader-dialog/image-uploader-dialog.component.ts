import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {SixImage} from '../../shared/models/six-image.model';

@Component({
  selector: 'image-uploader-dialog',
  templateUrl: './image-uploader-dialog.component.html',
  styleUrls: ['./image-uploader-dialog.component.scss']
})
export class ImageUploaderDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ImageUploaderDialogComponent>) { }

  ngOnInit() {
  }

  upload(image: SixImage) {
    this.dialogRef.close({image: image})
  }

  close(): void {
    this.dialogRef.close({});
  }
}
