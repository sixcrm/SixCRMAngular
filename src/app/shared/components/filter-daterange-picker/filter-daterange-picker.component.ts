import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {utc, Moment} from 'moment';

@Component({
  selector: 'filter-daterange-picker',
  templateUrl: './filter-daterange-picker.component.html',
  styleUrls: ['./filter-daterange-picker.component.scss']
})
export class FilterDaterangePickerComponent implements OnInit {

  _date: {start: Moment, end: Moment} = {start: utc().subtract(1, 'M'), end: utc()};

  @Input() set date(value: {start: Moment, end: Moment}) {
    this._date = value;
    this.updateDatepicker();
  }
  @Output() dateChanged: EventEmitter<{start: Moment, end: Moment}> = new EventEmitter();

  options = {};

  constructor() { }

  ngOnInit() {
  }

  private updateDatepicker(): void {

    this.options = {
      parentEl: '.datepicker--custom--filters--filter',
      startDate: this._date.start.clone(),
      endDate: this._date.end.clone(),
      locale: {
        format: 'MM/DD/YYYY',
      },
      alwaysShowCalendars: true,
      applyClass: 'btn-success-custom',
      linkedCalendars: false
    };

  }

  emitDateSelected(event) {
    this.dateChanged.emit({start: event.start, end: event.end})
  }
}
