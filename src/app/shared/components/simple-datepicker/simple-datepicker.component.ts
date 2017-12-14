import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {utc, Moment} from 'moment';

@Component({
  selector: 'simple-datepicker',
  templateUrl: './simple-datepicker.component.html',
  styleUrls: ['./simple-datepicker.component.scss']
})
export class SimpleDatepickerComponent implements OnInit {

  @Input() initialDate: Moment = utc();
  @Input() pholder: string;
  @Input() disabled: boolean;
  @Input() identifier: string;

  @Output() dateChanged: EventEmitter<Moment> = new EventEmitter();

  datepickerVisible: boolean = false;

  public options;

  constructor() { }

  ngOnInit() {
    this.options = {
      singleDatePicker: true,
      showDropdowns: true,
      opens: "left",
      startDate: this.initialDate,
      parentEl: '.datepicker--custom--' + this.identifier,
    };
  }

  datepickerShown() {
    this.datepickerVisible = true;
  }

  datepickerHidden() {
    this.datepickerVisible = false;
  }

  dateSelected(selection) {
    this.dateChanged.emit(selection.start.clone());
  }
}
