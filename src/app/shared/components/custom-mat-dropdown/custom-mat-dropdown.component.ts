import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'custom-mat-dropdown',
  templateUrl: './custom-mat-dropdown.component.html',
  styleUrls: ['./custom-mat-dropdown.component.scss']
})
export class CustomMatDropdownComponent implements OnInit {

  @Input() editable: boolean = true;
  @Input() showError: boolean;
  @Input() showAddNew: boolean = true;
  @Input() items: any[] = [];
  @Input() selectedItem: any;
  @Input() placeholder: string;
  @Input() mapper: (e: any) => any = (e) => e;

  @Output() selectItem: EventEmitter<any> = new EventEmitter();
  @Output() addNewSelected: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
