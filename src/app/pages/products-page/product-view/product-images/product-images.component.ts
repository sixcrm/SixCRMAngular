import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {FileUploader, FileItem} from 'ng2-file-upload';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SixImage} from '../../../../shared/models/six-image.model';
import {ImagesService} from '../../../../shared/services/images.service';
import {Subscription} from 'rxjs';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {ProductsService} from '../../../../shared/services/products.service';

@Component({
  selector: 'product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss']
})
export class ProductImagesComponent implements OnInit, OnDestroy {

  @Input() images: SixImage[] = [];
  @Output() imageUploaded: EventEmitter<SixImage> = new EventEmitter();

  private sub: Subscription;
  private productSub: Subscription;
  public uploader: FileUploader = new FileUploader({});
  public filePreviewPath: SafeUrl;
  private rawImage: string;

  constructor(private sanitizer: DomSanitizer, private imageService: ImagesService, private productService: ProductsService) { }

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

}
