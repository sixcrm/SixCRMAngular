import {Component, OnInit, Input, Output, EventEmitter, ElementRef} from '@angular/core';

@Component({
  selector: 'autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss'],
  host: {'(document:click)': 'closeDropdown($event)'}
})
export class AutocompleteInputComponent implements OnInit {

  currentValue: string;
  initValue: string;
  showOptions: boolean;

  @Input() set initialValue(value: string) {
    this.initValue = value;
    this.currentValue = value;
  };
  @Input() options: string[];
  @Input() placeholder: string;
  @Output() selected: EventEmitter<string> = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  optionSelected(option: string): void {
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
}
