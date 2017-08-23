import {Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChildren, ViewChild, QueryList} from '@angular/core';

@Component({
  selector: 'autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss'],
  host: {'(document:click)': 'closeDropdown($event)'}
})
export class AutocompleteInputComponent implements OnInit {

  @ViewChildren('autocompleteOption') optionFields: QueryList<ElementRef>;
  @ViewChild('optionsContainer') optionsContainer: ElementRef;

  currentValue: string;
  initValue: string;
  showOptions: boolean;
  allOptions: any[] = [];
  filteredOptions: any[] = [];

  @Input() mapFunction = (el: any) => el;

  @Input() set initialValue(value: string) {
    this.initValue = value;
    this.currentValue = this.mapFunction(value);
    this.filterOptions();
  };
  @Input() set options(opts: any[]) {
    if (!opts) return;

    this.allOptions = opts.slice();

    if (this.currentValue) {
      this.filterOptions();
    }
  }
  @Input() placeholder: string;
  @Input() showCancelButton: boolean = true;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Output() selected: EventEmitter<any> = new EventEmitter();

  focusedOptionIndex: number = 0;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  optionSelected(option: any): void {
    this.selected.emit(option);
    this.showOptions = false;
  }

  clearCurrentValue(input): void {
    this.currentValue = '';
    input.focus();
  }

  closeDropdown(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showOptions = false;
    }
  }

  blurred() {
    this.emitSelected();
  }

  focused() {
    this.showOptions = true;
    this.filterOptions();
  }

  emitSelected() {
    const selectedValue = this.filteredOptions[this.focusedOptionIndex];

    if (!selectedValue) {
      this.currentValue = this.mapFunction(this.initValue);
    } else {
      this.currentValue = this.mapFunction(selectedValue);
      this.selected.emit(selectedValue);
    }

    this.showOptions = false;
  }

  onKey(keyboardEvent) {
    switch (keyboardEvent.key) {
      case 'Enter': {}
      case 'Tab': {
        this.emitSelected();
        break;
      }
      case 'ArrowDown': {
        this.focusedOptionIndex++;
        if (this.focusedOptionIndex >= this.filteredOptions.length) {
          this.focusedOptionIndex = 0;
        }
        this.ensureOptionVisible();
        break;
      }
      case 'ArrowUp': {
        this.focusedOptionIndex--;
        if (this.focusedOptionIndex < 0) {
          this.focusedOptionIndex = this.filteredOptions.length - 1;
        }
        this.ensureOptionVisible();
        break;
      }
      default: {
        this.showOptions = true;
        this.focusedOptionIndex = 0;
      }
    }
  }

  change(value) {
    this.currentValue = value;
    this.filterOptions();
  }

  ensureOptionVisible() {
    const option = this.optionFields.toArray()[this.focusedOptionIndex];
    if (option) {
      const nativeEl = option.nativeElement;

      if ( (nativeEl.offsetTop + nativeEl.offsetHeight) > this.optionsContainer.nativeElement.scrollTop + this.optionsContainer.nativeElement.offsetHeight ){
        this.optionsContainer.nativeElement.scrollTop = nativeEl.offsetTop + nativeEl.offsetHeight - this.optionsContainer.nativeElement.offsetHeight;
      } else if (nativeEl.offsetTop < this.optionsContainer.nativeElement.scrollTop) {
        this.optionsContainer.nativeElement.scrollTop = nativeEl.offsetTop;
      }
    }
  }

  filterOptions() {
    this.filteredOptions = (() => {
      if (!this.allOptions || this.allOptions.length === 0 || !this.mapFunction) return [];
      if (!this.currentValue) return this.allOptions;

      const fs = this.currentValue.toUpperCase();

      return this.allOptions.filter(s => this.mapFunction(s).toUpperCase().indexOf(fs) !== -1);
    })()
  }
}
