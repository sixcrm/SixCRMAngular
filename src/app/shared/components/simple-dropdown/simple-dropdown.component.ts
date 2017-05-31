import {Component, OnInit, Input, Output, EventEmitter, ElementRef} from '@angular/core';

@Component({
  selector: 'simple-dropdown',
  templateUrl: './simple-dropdown.component.html',
  styleUrls: ['./simple-dropdown.component.scss'],
  host: {'(document:click)': 'closeDropdown($event)'}
})
export class SimpleDropdownComponent implements OnInit {

  @Input() selectedOption: any;
  @Input() options: any[];
  @Input() icon: string;
  @Input() mapper: (element: any) => string = (element: any) => element;
  @Output() optionSelected: EventEmitter<any> = new EventEmitter();

  dropdownVisible: boolean = false;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  closeDropdown(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownVisible = false;
    }
  }

  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  getHeight(): string {
    if (!this.dropdownVisible || !this.options) return '0';

    return this.options.length * 48 + 'px';
  }

  select(option: any): void {
    this.optionSelected.emit(option);
    this.dropdownVisible = false;
  }
}
