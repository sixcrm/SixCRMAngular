import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'table-memory-advanced',
  templateUrl: './table-memory-advanced.component.html',
  styleUrls: ['./table-memory-advanced.component.scss']
})
export class TableMemoryAdvancedComponent implements OnInit, OnDestroy {

  @Input() items: any[];
  @Input() columnParams: ColumnParams<any>[] = [];
  @Input() rowColorFunction: (any) => string;
  @Input() options: string[] = [];
  @Input() bulkOptions: string[] = [];
  @Input() title: string;
  @Input() loading: boolean;
  @Input() loadingNumberOfRows: number = 3;

  @Output() optionSelected: EventEmitter<{items: any[], option: string}> = new EventEmitter();
  @Output() itemClicked: EventEmitter<{item: any, param: ColumnParams<any>}> = new EventEmitter();

  filterString: string;
  selectedBulkOption: string;

  filterDebouncer: Subject<boolean> = new Subject();
  filterDebouncerSub: Subscription;

  constructor() { }

  ngOnInit() {
    this.filterDebouncerSub = this.filterDebouncer.debounceTime(250).subscribe(() => {
      this.items = this.items.map(i => {
        const fs = this.filterString;

        i['hideAfterFilter'] = fs && !this.shouldShowAfterFilter(i, fs);

        return i;
      })
    })
  }

  private shouldShowAfterFilter(item: any, filterString: string) {
    for (let param of this.columnParams) {
      if ((param.mappingFunction(item)+ '').toLowerCase().indexOf(filterString) !== -1) {
        return true;
      }
    }

    return false;
  }

  ngOnDestroy() {
    if (this.filterDebouncerSub) {
      this.filterDebouncerSub.unsubscribe();
    }
  }

  clicked(item: any, param: ColumnParams<any>) {
    if (!item || !param || !param.clickable) return;

    this.itemClicked.emit({item: item, param: param});
  }

  globalCheckboxClicked(event) {
    this.items = this.items.map(i => {

      if (!i['hideAfterFilter']) {
        i['bulkSelected'] = event.checked;
      }

      return i;
    })
  }

  getNumberOfSelected() {
    return !this.items || this.items.length === 0 ? 0 : this.items.filter(i => i['bulkSelected']).length;
  }

  getNumberOfVisible() {
    return !this.items || this.items.length === 0 ? 0 : this.items.filter(i => !i['hideAfterFilter']).length;
  }
}
