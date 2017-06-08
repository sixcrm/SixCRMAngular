import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'input-credit-card',
  templateUrl: './input-credit-card.component.html',
  styleUrls: ['./input-credit-card.component.scss']
})
export class InputCreditCardComponent implements OnInit {

  changed: boolean = false;
  inputValue: string;

  @Input() set value(value: string) {
    this.inputValue = value;
  }
  @Input() placeholder: string;
  @Input() mode: string;
  @Output() result: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  change(value) {
    if (!this.changed) {
      this.result.emit(value.length === 1 ? value : '');
      this.changed = true;
      return;
    }

    this.result.emit(value);
  }

  isAllowedNumeric(event): boolean {
    const pattern = /[0-9]|Backspace|ArrowRight|ArrowLeft/;

    if (!pattern.test(event.key)) {
      event.preventDefault();
      return false;
    }

    if (/[0-9]/.test(event.key) && ((this.mode === 'ccv' && this.inputValue.length >= 4) || this.inputValue.length >= 16) ) {
      event.preventDefault();
    }

    return true;
  }

}
