import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Rebill} from '../../../../shared/models/rebill.model';
import {RebillsService} from '../../../../entity-services/services/rebills.service';
import {Moment, utc} from 'moment';
import {DaterangepickerConfig} from 'ng2-daterangepicker';
import {Currency} from '../../../../shared/utils/currency/currency';

@Component({
  selector: 'customer-rebill-edit',
  templateUrl: './customer-rebill-edit.component.html',
  styleUrls: ['./customer-rebill-edit.component.scss']
})
export class CustomerRebillEditComponent implements OnInit {

  @ViewChild('priceInput') priceInput;

  rebill: Rebill;
  originalPrice: Currency;
  date: Moment;

  @Input() set value(rebill: Rebill) {
    if (rebill) {
      this.rebill = rebill;
      this.originalPrice = new Currency(rebill.amount.amount);
      this.date = this.rebill.billAt.clone();
      this.setDatepickerOptions();
    }
  }

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();

  datepickerVisible: boolean = false;

  constructor(
    private rebillService: RebillsService,
    private daterangepickerOptions: DaterangepickerConfig
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
    if (this.rebill.amount.amount > this.originalPrice.amount) {
      this.rebill.amount = new Currency(this.originalPrice.amount);
      this.priceInput.nativeElement.focus();
      return;
    }

    this.rebill.billAt = this.date.clone();
    this.rebillService.entityUpdated$.take(1).subscribe(() => {
      this.cancel.emit(true);
    });

    this.rebillService.updateEntity(this.rebill);
  }

  cancelRebillEdit() {
    this.rebill.amount = new Currency(this.originalPrice.amount);

    this.cancel.emit(false)
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
