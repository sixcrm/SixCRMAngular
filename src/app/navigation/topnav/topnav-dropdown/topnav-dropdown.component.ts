import {Component, OnInit, Input, ElementRef} from '@angular/core';

export interface TopnavDropdownOption {
  label: string;
  callback: () => void;
}

@Component({
  selector: 'topnav-dropdown',
  templateUrl: './topnav-dropdown.component.html',
  styleUrls: ['./topnav-dropdown.component.scss'],
  host: {'(document:click)': 'closeDropdown($event)'}
})
export class TopnavDropdownComponent implements OnInit {

  @Input() icon: string;
  @Input() text: string;
  @Input() action: boolean;
  @Input() small: boolean;
  @Input() openOnLeft: boolean;
  @Input() options: TopnavDropdownOption[] = [];

  dropdownVisible: boolean;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() { }

  closeDropdown(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownVisible = false;
    }
  }

  optionClicked(option: TopnavDropdownOption) {
    option.callback();

    this.dropdownVisible = false;
  }
}
