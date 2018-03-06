import {Directive, ElementRef, Input, Output, EventEmitter} from '@angular/core';
import {Currency} from '../utils/currency/currency';

const numeral = require('numeral');

@Directive({
  selector: '[currencyInput]',
  host: {
    '(input)': 'onInput($event)'
  }
})
export class CurrencyInputDirective {

  @Input() set initPrice(value: Currency) {
    if (!value) {
      value = new Currency(0);
    }

    this.updateValue(value.amount.toFixed(2));
  }

  @Output() priceChanged: EventEmitter<Currency> = new EventEmitter();

  private inputElement: HTMLInputElement;

  constructor(private el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  onInput(event) {
    const value = event.target.value.replace(/\$|,/g, '');

    const shouldFormat = this.inputElement.selectionStart === this.inputElement.value.length;

    let parsedValue = value;

    if (shouldFormat) {
      const precision = this.getPrecision(value);

      if (precision === 0) {
        parsedValue = (+value/100).toFixed(2);
      } else if (precision === 1) {
        parsedValue = (+value/10).toFixed(2);
      } else {
        parsedValue = (+value*10).toFixed(2);
      }
    }

    this.updateValue(parsedValue);
    this.emitChanged();
  }

  updateValue(value) {
    this.inputElement.value = '$' + numeral(value).format('0,0.00');
  }

  getPrecision(value) {
    if (!value) return 0;

    const split = value.split('.');

    return split[1] ? split[1].length : 0;
  }

  emitChanged() {
    const value = this.inputElement.value;

    if (!value) {
      this.priceChanged.emit(new Currency(0));

      return;
    }

    this.priceChanged.emit(new Currency(+value.replace(/\$|,/g, '')));
  }
}
