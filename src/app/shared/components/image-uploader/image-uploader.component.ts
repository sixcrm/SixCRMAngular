import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {FileItem, FileUploader} from 'ng2-file-upload';
import {SafeUrl, DomSanitizer} from '@angular/platform-browser';
import {CustomServerError} from '../../models/errors/custom-server-error';
import {ImagesService} from '../../../entity-services/services/images.service';
import {Subscription} from 'rxjs';
import {SixImage} from '../../models/six-image.model';

@Component({
  selector: 'image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit, OnDestroy {

  @Output() imageUploaded: EventEmitter<SixImage> = new EventEmitter();

  public uploader: FileUploader = new FileUploader({
    allowedMimeType: ['image/jpg', 'image/jpeg', 'image/svg', 'image/png', 'image/svg+xml'],
    maxFileSize: 1024*1024
  });

  public filePreviewPath: SafeUrl;
  private rawImage: string;

  onDropzone: boolean;

  uploadInProgress: boolean;

  private sub: Subscription;

  constructor(private imageService: ImagesService, private sanitizer: DomSanitizer) { }

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

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  public fileOnDropzone(e:boolean):void {
    this.onDropzone = e;
  }

  clearImage() {
    this.uploader.clearQueue();
    this.filePreviewPath = undefined;
    this.rawImage = undefined;
  }

  uploadImage() {
    if (!this.rawImage || this.uploadInProgress) return;

    this.uploadInProgress = true;

    this.sub = this.imageService.entityCreated$.take(1).subscribe(img => {
      if (img instanceof CustomServerError) {
        this.uploadInProgress = false;
        return;
      }

      this.imageUploaded.next(img);
      this.uploadInProgress = false;
      this.clearImage();
    });

    this.imageService.createEntity(new SixImage({raw: this.rawImage}));
  }

}
