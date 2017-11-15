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
  @Input() small: boolean;
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
    if (!this.dropdownVisible && this.getOptions().length === 0) {
      return;
    }

    this.dropdownVisible = !this.dropdownVisible;
  }

  getHeight(): string {
    if (!this.dropdownVisible || !this.getOptions()) return '0';

    return this.getOptions().length * (this.small ? 44 : 48) + 'px';
  }

  select(option: any): void {
    this.optionSelected.emit(option);
    this.dropdownVisible = false;
  }

  getOptions(): any[] {
    if (!this.options) return [];

    return this.options.filter(el => this.mapper(el) !== this.mapper(this.selectedOption))
  }
}
