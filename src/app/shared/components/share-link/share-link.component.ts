import {Component, OnInit, Input, ElementRef} from '@angular/core';

@Component({
  selector: 'share-link',
  templateUrl: './share-link.component.html',
  styleUrls: ['./share-link.component.scss'],
  host: {'(document:click)': 'onClick($event)'},
})
export class ShareLinkComponent implements OnInit {

  @Input() shareUrl: string;

  shareVisible: boolean = false;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  copyUrlToClipboard(urlField): void {
    urlField.select();
    document.execCommand('copy');
  }

  showShare(): void {
    this.shareVisible = true;
  }

  onClick(event): void {
    // close if clicked outside
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.shareVisible = false;
    }
  }
}
