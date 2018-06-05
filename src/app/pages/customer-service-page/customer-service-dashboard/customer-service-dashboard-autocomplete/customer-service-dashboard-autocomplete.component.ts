import {
  Component, OnInit, Input, Output, EventEmitter, ViewChildren, ViewChild, ElementRef,
  QueryList
} from '@angular/core';
import {Customer} from '../../../../shared/models/customer.model';
import {Session} from '../../../../shared/models/session.model';

@Component({
  selector: 'customer-service-dashboard-autocomplete',
  templateUrl: './customer-service-dashboard-autocomplete.component.html',
  styleUrls: ['./customer-service-dashboard-autocomplete.component.scss'],
  host: {'(document:keydown)':'onKeyDown($event)'},
})

export class CustomerServiceDashboardAutocompleteComponent implements OnInit {

  @Input() customers: Customer[];
  @Input() sessions: Session[];
  @Output() select: EventEmitter<Customer | Session> = new EventEmitter();

  @ViewChildren('autocompleteOptions') optionFields: QueryList<ElementRef>;
  @ViewChild('autocompleteContainer') optionsContainer: ElementRef;

  focusedOptionIndex: number = -1;

  constructor() {}

  ngOnInit() { }

  onKeyDown(keyboardEvent) {
    const options = this.customers || this.sessions;

    switch (keyboardEvent.key) {
      case 'Enter': {
        this.select.emit(options[this.focusedOptionIndex]);
        break;
      }
      case 'ArrowDown': {
        this.focusedOptionIndex++;
        if (this.focusedOptionIndex >= options.length) {
          this.focusedOptionIndex = 0;
        }
        this.ensureOptionVisible();
        break;
      }
      case 'ArrowUp': {
        this.focusedOptionIndex--;
        if (this.focusedOptionIndex < 0) {
          this.focusedOptionIndex = options.length - 1;
        }
        this.ensureOptionVisible();
        break;
      }
      case 'Escape': {
        this.focusedOptionIndex = -1;
      }
      default: { }
    }
  }

  ensureOptionVisible(): void {
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

}
