import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ColumnParams} from '../../../shared/models/column-params.model';

@Component({
  selector: 'table-memory-advanced',
  templateUrl: './table-memory-advanced.component.html',
  styleUrls: ['./table-memory-advanced.component.scss']
})
export class TableMemoryAdvancedComponent implements OnInit {

  @Input() items: any[];
  @Input() columnParams: ColumnParams<any>[] = [];
  @Input() options: string[] = [];
  @Input() bulkOptions: string[] = [];
  @Input() title: string;
  @Input() loading: boolean;
  @Input() loadingNumberOfRows: number = 3;

  @Output() optionSelected: EventEmitter<{items: any[], option: string}> = new EventEmitter();
  @Output() itemClicked: EventEmitter<{item: any, param: ColumnParams<any>}> = new EventEmitter();

  filterString: string;
  selectedBulkOption: string;

  constructor() { }

  ngOnInit() {
  }

  clicked(item: any, param: ColumnParams<any>) {
    if (!item || !param || !param.clickable) return;

    this.itemClicked.emit({item: item, param: param});
  }

  globalCheckboxClicked(event) {
    this.items = this.items.map(i => {
      i['bulkSelected'] = event.checked;

      return i;
    })
  }

  getNumberOfSelected() {
    return !this.items || this.items.length === 0 ? 0 : this.items.filter(i => i['bulkSelected']).length;
  }
}
