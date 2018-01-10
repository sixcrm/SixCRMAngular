import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {utc, Moment} from 'moment';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {TranslationService} from '../../../translation/translation.service';
import {getDays, getMonths} from '../../utils/date.utils';

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

  constructor(private authService: AuthenticationService, private translationService: TranslationService) { }

  ngOnInit() {
    if (this.authService.getUserSettings().language) {
      this.initDatepicker();
    } else {
      this.authService.userSettings$.take(1).subscribe(() => this.initDatepicker())
    }
  }

  initDatepicker() {
    this.options = {
      singleDatePicker: true,
      showDropdowns: true,
      opens: "left",
      startDate: this.initialDate,
      parentEl: '.datepicker--custom--' + this.identifier,
      locale: {
        applyLabel: this.translationService.translate('DATEPICKER_APPLY'),
        cancelLabel: this.translationService.translate('DATEPICKER_CANCEL'),
        monthNames: getMonths(this.translationService),
        daysOfWeek: getDays(this.translationService)
      }
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
