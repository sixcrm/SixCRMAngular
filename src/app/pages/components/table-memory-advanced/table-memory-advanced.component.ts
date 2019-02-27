import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {Subject, Subscription} from 'rxjs';

export interface OptionItem {
  label: string,
  visible: (el: any) => boolean
}

@Component({
  selector: 'table-memory-advanced',
  templateUrl: './table-memory-advanced.component.html',
  styleUrls: ['./table-memory-advanced.component.scss']
})
export class TableMemoryAdvancedComponent implements OnInit, OnDestroy {

  @Input() items: any[];
  @Input() columnParams: ColumnParams<any>[] = [];
  @Input() rowColorFunction: (any) => string;
  @Input() lineBreakFunction: (previous: any, next: any) => string;
  @Input() options: OptionItem[];
  @Input() bulkOptions: string[];
  @Input() title: string;
  @Input() loading: boolean;
  @Input() loadingNumberOfRows: number = 3;

  @Output() multiOptionSelected: EventEmitter<{items: any[], option: string}> = new EventEmitter();
  @Output() optionSelected: EventEmitter<{item: any, option: OptionItem}> = new EventEmitter();

  filterString: string;
  selectedBulkOption: string;

  filterDebouncer: Subject<boolean> = new Subject();
  filterDebouncerSub: Subscription;

  sortParams: ColumnParams<any> = new ColumnParams();

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

  setSortParams(params: ColumnParams<any>): void {
    if (this.sortParams.label === params.label) {
      this.sortParams.sortOrder = this.sortParams.sortOrder !== 'asc' ? 'asc' : 'desc';
    } else {
      this.sortParams.sortApplied = false;
      this.sortParams = params;
      this.sortParams.sortApplied = true;
    }
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

  emitOptionSelected(item: any, option: OptionItem) {
    this.optionSelected.emit({item: item, option: option})
  }

  applyMultiOption() {
    this.multiOptionSelected.emit(
      {
        items: this.items.filter(i => i['bulkSelected']),
        option: this.selectedBulkOption
      }
    )
  }
}
