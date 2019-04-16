import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Product} from '../../../../shared/models/product.model';
import {DeleteDialogComponent} from '../../../../dialog-modals/delete-dialog.component';
import {MatDialog} from '@angular/material';
import {ImageUploaderDialogComponent} from '../../../../dialog-modals/image-uploader-dialog/image-uploader-dialog.component';

@Component({
  selector: 'product-images-gallery',
  templateUrl: './product-images-gallery.component.html',
  styleUrls: ['./product-images-gallery.component.scss']
})
export class ProductImagesGalleryComponent implements OnInit {

  @Input() product: Product;

  @Output() imageDeleted: EventEmitter<string> = new EventEmitter();
  @Output() setDefaultImage: EventEmitter<string> = new EventEmitter();
  @Output() uploadImage: EventEmitter<string> = new EventEmitter();

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  deleteImage(image: string) {
    let deleteDialogRef = this.dialog.open(DeleteDialogComponent);

    deleteDialogRef.afterClosed().take(1).subscribe(result => {
      deleteDialogRef = null;

      if (result && result.success) {
        this.imageDeleted.next(image);
      }
    });
  }

  displayImageUploadDialog() {
    let uploadDialog = this.dialog.open(ImageUploaderDialogComponent);

    uploadDialog.afterClosed().take(1).subscribe(result => {
      uploadDialog = null;

      if (result && result.image) {
        this.uploadImage.emit(result.image.path);
      }
    })
  }

  toggleFavorite(image, i) {
    if (i === 0) return;

    this.setDefaultImage.emit(image);
  }
}
