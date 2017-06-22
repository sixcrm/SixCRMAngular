import {Component, OnInit, Input, Output, EventEmitter, ElementRef} from '@angular/core';

@Component({
  selector: 'dropdown-component',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  host: {'(document:click)': 'handleDropdownVisibility($event)'}
})
export class DropdownComponent implements OnInit {

  @Input() options: string[] = [];
  @Input() selected: string;
  @Input() placeholder: string;
  @Input() required: boolean = false;
  @Input() showFloatingPlaceholder: boolean = true;
  @Input() mapper: (el: any) => string = (el: any) => el;
  @Input() disabled: boolean = false;

  @Output() onSelect: EventEmitter<string> = new EventEmitter();

  showDropdown: boolean = false;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() { }

  select(option: string): void {
    this.onSelect.emit(option);
    this.showDropdown = false;
  }

  toggleDropdown(): void {
    if (this.disabled) return;

    this.showDropdown = !this.showDropdown;
  }

  handleDropdownVisibility(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}
