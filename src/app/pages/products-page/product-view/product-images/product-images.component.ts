import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {FileUploader, FileItem} from 'ng2-file-upload';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SixImage} from '../../../../shared/models/six-image.model';
import {ImagesService} from '../../../../shared/services/images.service';
import {Subscription} from 'rxjs';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {ProductsService} from '../../../../shared/services/products.service';
import {ImageDialogComponent} from '../../../../dialog-modals/image-dialog/image-dialog.component';
import {MdDialog} from '@angular/material';
import {DeleteDialogComponent} from '../../../delete-dialog.component';

@Component({
  selector: 'product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss']
})
export class ProductImagesComponent implements OnInit, OnDestroy {

  @Input() images: SixImage[] = [];
  @Output() imageUploaded: EventEmitter<SixImage> = new EventEmitter();
  @Output() imageUpdated: EventEmitter<SixImage> = new EventEmitter();
  @Output() imageDeleted: EventEmitter<SixImage> = new EventEmitter();

  private sub: Subscription;
  private productSub: Subscription;
  public uploader: FileUploader = new FileUploader({});
  public filePreviewPath: SafeUrl;
  private rawImage: string;

  onDropzone: boolean;

  constructor(
    private sanitizer: DomSanitizer,
    private imageService: ImagesService,
    private productService: ProductsService,
    private dialog: MdDialog
  ) { }

  uploadImage() {
    if (!this.rawImage) return;

    this.sub = this.imageService.entityCreated$.take(1).subscribe(img => {
      if (img instanceof CustomServerError) return;

      this.imageUploaded.next(img);
    });

    this.productSub = this.productService.entityUpdated$.subscribe((data) => {
      if (data instanceof CustomServerError) return;

      this.uploader.clearQueue();
      this.rawImage = undefined;
      this.filePreviewPath = undefined;
    });

    this.imageService.createEntity(new SixImage({raw: this.rawImage}));
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }

    if (this.productSub) {
      this.sub.unsubscribe();
    }
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file: FileItem) => {
      const fileReader = new FileReader();

      fileReader.onloadend = () => {
        const imageData = fileReader.result;
        const rawData = imageData.split("base64,")[1];

        if (rawData.length > 1) {
          this.filePreviewPath  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
          this.rawImage = rawData;
        }
      };

      fileReader.readAsDataURL(file._file);

    }
  }

  editImage(image: SixImage) {
    let imageDialogRef = this.dialog.open(ImageDialogComponent);
    imageDialogRef.componentInstance.image = image.copy();
    imageDialogRef.componentInstance.editMode = true;


    imageDialogRef.afterClosed().take(1).subscribe((response) => {
      imageDialogRef = null;

      this.imageUpdated.emit(response.image);
    });
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

  public fileOnDropzone(e:boolean):void {
    this.onDropzone = e;
  }
}
