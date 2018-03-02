import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'entity-view-gallery',
  templateUrl: './entity-view-gallery.component.html',
  styleUrls: ['./entity-view-gallery.component.scss']
})
export class EntityViewGalleryComponent implements OnInit {

  @Input() mapper: (any) => string = e => e;
  @Input() images: string[] = [];
  @Input() defaultImage: string;

  constructor() { }

  ngOnInit() {
  }

}
