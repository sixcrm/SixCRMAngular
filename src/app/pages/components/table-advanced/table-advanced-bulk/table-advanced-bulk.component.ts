import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';

@Component({
  selector: 'table-advanced-bulk',
  templateUrl: './table-advanced-bulk.component.html',
  styleUrls: ['./table-advanced-bulk.component.scss'],
  host: {'(document:click)': 'closeDropdown($event)'}
})
export class TableAdvancedBulkComponent implements OnInit {

  @Input() entities: any[];

  @Output() deleteAllSelected: EventEmitter<any[]> = new EventEmitter();

  @ViewChild('options') options;
  @ViewChild('arrow') arrow;

  visible: boolean = true;
  showOptions: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  getNumberOfSelected() {
    if (!this.entities || this.entities.length === 0) return 0;

    return this.entities.filter(e => e.bulkSelected).length;
  }

  selectAll() {
    this.showOptions = false;

    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].bulkSelected = true;
    }
  }

  deselectAll() {
    this.showOptions = false;

    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].bulkSelected = false;
    }
  }

  deleteAll() {
    this.showOptions = false;

    this.deleteAllSelected.emit(this.entities.filter(e => e.bulkSelected));
  }

  closeDropdown(event) {
    if (!this.options || !this.arrow) return;

    if (!this.options.nativeElement.contains(event.target) && !this.arrow.nativeElement.contains(event.target)) {
      this.showOptions = false;
    }
  }
}
