import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList, ElementRef} from '@angular/core';

@Component({
  selector: 'autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  host: {'(document:keydown)':'onKeyDown($event)'},
})
export class AutocompleteComponent implements OnInit {

  @Input() options: string[] = [];
  @Output() select: EventEmitter<string> = new EventEmitter();

  @ViewChildren('autocompleteOptions') optionFields: QueryList<ElementRef>;
  @ViewChild('autocompleteContainer') optionsContainer: ElementRef;

  focusedOptionIndex: number = -1;

  constructor() { }

  ngOnInit() { }

  onKeyDown(keyboardEvent) {
    switch (keyboardEvent.key) {
      case 'Tab': {
      }
      case 'ArrowDown': {
        this.focusedOptionIndex++;
        if (this.focusedOptionIndex >= this.options.length) {
          this.focusedOptionIndex = 0;
        }
        this.ensureOptionVisible();
        break;
      }
      case 'ArrowUp': {
        this.focusedOptionIndex--;
        if (this.focusedOptionIndex < 0) {
          this.focusedOptionIndex = this.options.length - 1;
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


  public getSelected(): string {
    return this.options[this.focusedOptionIndex];
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
