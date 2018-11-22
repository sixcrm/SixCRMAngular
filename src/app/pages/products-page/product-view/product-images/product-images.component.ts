import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {SixImage} from '../../../../shared/models/six-image.model';
import {ImageDialogComponent} from '../../../../dialog-modals/image-dialog/image-dialog.component';
import {DeleteDialogComponent} from '../../../../dialog-modals/delete-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss']
})
export class ProductImagesComponent implements OnInit {

  @Input() images: SixImage[] = [];
  @Output() imageUploaded: EventEmitter<SixImage> = new EventEmitter();
  @Output() imageUpdated: EventEmitter<SixImage> = new EventEmitter();
  @Output() imageDeleted: EventEmitter<SixImage> = new EventEmitter();

  private editCopy: SixImage;

  constructor(private dialog: MatDialog) { }

  uploadImage(image: SixImage) {
    this.imageUploaded.next(image);
  }

  ngOnInit() {}

  editImage(image: SixImage) {
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].editMode = this.images[i].path === image.path;

      if (this.images[i].editMode) {
        this.editCopy = this.images[i].copy();
      }
    }
  }

  cancelEdit() {
    for (let i = 0; i < this.images.length; i++) {
      if (this.images[i].editMode) {
        this.images[i] = this.editCopy.copy();
      }

      this.images[i].editMode = false;
    }
  }

  updateImage(image: SixImage) {
    this.imageUpdated.emit(image);
  }

  cancelUpdate(image: SixImage) {
    this.imageUpdated.emit(image);
  }

  deleteImage(image: SixImage) {
    let deleteDialogRef = this.dialog.open(DeleteDialogComponent);

    deleteDialogRef.afterClosed().take(1).subscribe(result => {
      deleteDialogRef = null;

      if (result && result.success) {
        this.imageDeleted.next(image);
      }
    });
  }

  viewImage(image: SixImage) {
    let imageDialogRef = this.dialog.open(ImageDialogComponent);
    imageDialogRef.componentInstance.image = image;


    imageDialogRef.afterClosed().take(1).subscribe(() => {
      imageDialogRef = null;
    });
  }
}
