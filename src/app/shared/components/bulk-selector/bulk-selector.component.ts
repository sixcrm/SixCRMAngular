import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'bulk-selector',
  templateUrl: './bulk-selector.component.html',
  styleUrls: ['./bulk-selector.component.scss']
})
export class BulkSelectorComponent implements OnInit {

  @Input() items: {bulkSelected: boolean}[] = [];
  @Input() options: string[] = [];

  @Output() applyOption: EventEmitter<string> = new EventEmitter();
  @Output() cancel: EventEmitter<string> = new EventEmitter();

  selectedOption: string;

  constructor() { }

  ngOnInit() {
  }

  getNumberOfSelected() {
    return (this.items || []).filter(i => i.bulkSelected).length;
  }

}
