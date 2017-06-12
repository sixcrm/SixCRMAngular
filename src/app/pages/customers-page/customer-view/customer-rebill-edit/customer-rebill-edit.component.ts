import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Rebill} from '../../../../shared/models/rebill.model';
import {RebillsService} from '../../../../shared/services/rebills.service';
import {Moment, utc} from 'moment';
import {DaterangepickerConfig} from 'ng2-daterangepicker';
import {ProgressBarService} from '../../../../shared/services/progress-bar.service';
import {getCurrencyMask, parseCurrencyMaskedValue} from '../../../../shared/utils/mask-utils';

@Component({
  selector: 'customer-rebill-edit',
  templateUrl: './customer-rebill-edit.component.html',
  styleUrls: ['./customer-rebill-edit.component.scss']
})
export class CustomerRebillEditComponent implements OnInit {

  @ViewChild('priceInput') priceInput;

  rebill: Rebill;
  price;
  date: Moment;

  @Input() set value(rebill: Rebill) {
    if (rebill) {
      this.rebill = rebill;
      this.price = this.rebill.amount.amount;
      this.date = this.rebill.billAt.clone();
      this.setDatepickerOptions();
    }
  }

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();

  datepickerVisible: boolean = false;

  numberMask = getCurrencyMask();

  constructor(
    private rebillService: RebillsService,
    private daterangepickerOptions: DaterangepickerConfig,
    private progressBarService: ProgressBarService
  ) { }

  ngOnInit() {

  }

  datepickerShown() {
    this.datepickerVisible = true;
  }

  datepickerHidden() {
    this.datepickerVisible = false;
  }

  dateSelected(value: any): void {
    this.date = utc(value.start);
  }

  saveRebill(): void {
    let price = parseCurrencyMaskedValue(this.price);

    if (price > this.rebill.amount.amount) {
      this.price = this.rebill.amount.amount;
      this.priceInput.nativeElement.focus();
      return;
    }

    this.rebill.amount.amount = price;
    this.rebill.billAt = this.date.clone();
    this.rebillService.entityUpdated$.take(1).subscribe(() => {
      this.progressBarService.hideTopProgressBar();
      this.cancel.emit(true);
    });

    this.progressBarService.showTopProgressBar();
    this.rebillService.updateEntity(this.rebill);
  }

  setDatepickerOptions(): void {
    this.daterangepickerOptions.settings = {
      parentEl: '.datepicker--custom',
      singleDatePicker: true,
      locale: { format: 'MM/DD/YYYY' },
      alwaysShowCalendars: true,
      applyClass: 'btn-success-custom',
    };
  }
}
