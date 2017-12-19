import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {ActivatedRoute, Router} from "@angular/router";

export interface TabHeaderElement {
  name: string,
  label: string
}

@Component({
  selector: 'tab-header',
  templateUrl: './tab-header.component.html',
  styleUrls: ['./tab-header.component.scss']
})
export class TabHeaderComponent implements OnInit, OnDestroy {

  @Input() elements: TabHeaderElement[] = [];
  @Input() selectedIndex: number = 0;
  @Output() select: EventEmitter<number> = new EventEmitter();

  sub: Subscription;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.fragment.subscribe((fragment) => {
      const tab = fragment;

      if (!tab) return;

      for (let i = 0; i < this.elements.length; i++) {
        if (this.elements[i].name === tab) {
          this.select.emit(i);

          break;
        }
      }

    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
