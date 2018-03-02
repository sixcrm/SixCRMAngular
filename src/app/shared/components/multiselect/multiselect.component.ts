import {Component, OnInit, Input, Output, EventEmitter, ElementRef} from '@angular/core';

@Component({
  selector: 'multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  host: {'(document:click)': 'onClick($event)'}
})
export class MultiselectComponent implements OnInit {

  _options: {multiselectSelected: boolean, value}[] = [];
  _selected: any[] = [];

  @Input() error: boolean;
  @Input() placeholder: string = 'placeholder';
  @Input() mapper: (el) => string = e => e;
  @Input() set options(value: any[]) {
    if (!value) {
      this._options = [];
      return;
    }

    this._options = value.map(v => {
      return {multiselectSelected: false, value: v};
    });
  }
  @Input() set selected(value: any[]){
    if (!value) {
      this._selected = [];
      return;
    }

    this._selected = value.slice();
  }

  @Output() onApply: EventEmitter<any[]> = new EventEmitter();

  dropdownVisible: boolean;

  allSelected: boolean = false;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  getSelected() {
    return this._options.filter(o => o.multiselectSelected).slice();
  }

  selectAll() {
    this._options = this._options.map(o => {
      o.multiselectSelected = this.allSelected;

      return o;
    })
  }

  showDropdown() {
    this._options = this._options.map(o => {
      o.multiselectSelected = (this._selected.indexOf(o.value) !== -1);

      return o;
    });

    setTimeout(() => this.dropdownVisible = true, 50);
  }

  apply() {
    this.onApply.emit(this._options.filter(o => o.multiselectSelected));

    this.cancel();
  }

  cancel() {
    this._options = this._options.map(o => {
      o.multiselectSelected = false;

      return o;
    });

    this.dropdownVisible = false;
    this.allSelected = false;
  }

  onClick(event) {
    if (this.dropdownVisible && !this.elementRef.nativeElement.contains(event.target)) {
      this.cancel();
    }
  }
}
