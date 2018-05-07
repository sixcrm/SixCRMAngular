import {Component, OnInit, Input, Output, EventEmitter, ElementRef} from '@angular/core';

@Component({
  selector: 'simple-dropdown',
  templateUrl: './simple-dropdown.component.html',
  styleUrls: ['./simple-dropdown.component.scss'],
  host: {'(document:click)': 'closeDropdown($event)'}
})
export class SimpleDropdownComponent implements OnInit {

  _options: any[];
  width: string = '100px';

  @Input() mapper: (element: any) => string = (element: any) => element;
  @Input() selectedOption: any;
  @Input() set options(values: any[]) {
    if (values && values.length > 0) {
      this.calculateWidth(values);
    }

    this._options = (values || []).slice();
  }
  @Input() icon: string;
  @Input() disabled: boolean;
  @Input() small: boolean;
  @Input() showInstructions: boolean;

  @Output() optionSelected: EventEmitter<any> = new EventEmitter();
  @Output() dismissInstructions: EventEmitter<boolean> = new EventEmitter();

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
    if (this.disabled || (!this.dropdownVisible && this.getOptions().length === 0)) {
      return;
    }

    this.dropdownVisible = !this.dropdownVisible;
  }

  getHeight(): string {
    if ((!this.dropdownVisible && !this.showInstructions) || !this.getOptions()) return '0';

    return this.getOptions().length * (this.small ? 44 : 48) + 'px';
  }

  getHeightNumber(): number {
    if ((!this.dropdownVisible && !this.showInstructions) || !this.getOptions()) return '0';

    return this.getOptions().length * (this.small ? 44 : 48);
  }

  select(option: any): void {
    this.optionSelected.emit(option);
    this.dropdownVisible = false;
  }

  getOptions(): any[] {
    if (!this._options) return [];

    return this._options.filter(el => this.mapper(el) !== this.mapper(this.selectedOption))
  }

  calculateWidth(options: any[]) {
    if (!options || options.length === 0) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = '14px';

    let max = 0;
    let temp;

    for (let i = 0; i < options.length; i++) {
      let text = this.mapper(options[i]);
      temp = context.measureText(text).width * 1.61;

      if (temp > max) {
        max = temp;
      }

    }

    this.width = (max - 40) + 'px';
  }

  getWidth(): string {
    if (this.dropdownVisible) {
      return this.width;
    }

    return '0px';
  }
}
