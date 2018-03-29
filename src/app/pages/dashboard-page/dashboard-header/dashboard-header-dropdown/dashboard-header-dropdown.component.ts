import {Component, OnInit, Input, Output, EventEmitter, ElementRef} from '@angular/core';

@Component({
  selector: 'dashboard-header-dropdown',
  templateUrl: './dashboard-header-dropdown.component.html',
  styleUrls: ['./dashboard-header-dropdown.component.scss'],
  host: {'(document:click)': 'closeDropdown($event)'}
})
export class DashboardHeaderDropdownComponent implements OnInit {

  @Input() items: any[] = [];
  @Input() selectedItem: any;
  @Input() mapper = (el) => el;
  @Input() selectedMapper = (el) => el.selected;

  @Output() selected: EventEmitter<any> = new EventEmitter();

  dropdownVisible: boolean = false;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  closeDropdown(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownVisible = false;
    }
  }

  emitSelected(item: any) {
    this.selected.emit(item);

    this.dropdownVisible = false;
  }
}
