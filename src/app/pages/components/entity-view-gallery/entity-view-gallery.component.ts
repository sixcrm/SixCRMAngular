import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Subscription, Observable} from 'rxjs';

@Component({
  selector: 'entity-view-gallery',
  templateUrl: './entity-view-gallery.component.html',
  styleUrls: ['./entity-view-gallery.component.scss']
})
export class EntityViewGalleryComponent implements OnInit {

  @ViewChild('holder') holder;
  @ViewChild('container') container;

  @Input() mapper: (any) => string = e => e;
  @Input() images: string[];
  @Input() defaultImage: string;
  @Input() showLoader: boolean = true;

  marginLeft: number = 0;

  offset: number = 123;

  sub: Subscription;

  constructor() { }

  ngOnInit() {
  }

  moveLeft() {
    this.stopMoving();

    this.sub = Observable.interval(180).startWith(0).subscribe(() => {
      if (this.marginLeft === 0) {
        this.stopMoving();
        return;
      }

      let m = this.marginLeft - this.offset;

      if (m < 0) {
        m = 0;
      }

      this.marginLeft = m;
    })
  }

  moveRight() {
    this.stopMoving();

    this.sub = Observable.interval(200).startWith(0).subscribe(() => {
      if (!this.showRightArrow()) {
        this.stopMoving();
        return;
      }

      this.marginLeft += this.offset;
    })
  }

  stopMoving() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  showRightArrow() {
    return (this.container.nativeElement.getBoundingClientRect().width + this.marginLeft) < this.holder.nativeElement.getBoundingClientRect().width;
  }

}
