import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'single-filter',
  templateUrl: './single-filter.component.html',
  styleUrls: ['./single-filter.component.scss']
})
export class SingleFilterComponent implements OnInit {

  @Input() items: any[] = [];
  @Input() options: any[];
  @Input() optionMapper: (el) => string = (el) => el;
  @Input() title: string;

  @Output() itemAdded: EventEmitter<boolean> = new EventEmitter();
  @Output() itemRemovedAtIndex: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  setItemAtIndex(index: number, item: any) {
    this.items[index] = item
  }

}
