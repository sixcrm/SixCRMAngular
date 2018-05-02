import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {Plan} from '../plan.model';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {isAllowedNumeric} from '../../../shared/utils/form.utils';
import {HttpWrapperTransactionalService} from '../../../shared/services/http-wrapper-transactional.service';
import {User} from '../../../shared/models/user.model';
import {TransactionalResponseError} from '../../../shared/models/transactional-response-error.model';

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  @Input() plan: Plan;
  @Input() user: User;
  @Output() changePlan: EventEmitter<boolean> = new EventEmitter();
  @Output() displayOwnerTerms: EventEmitter<boolean> = new EventEmitter();
  @Output() paymentSuccessful: EventEmitter<boolean> = new EventEmitter();

  months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  years = ['2018','2019','2020','2021','2022','2023','2024','2025','2026','2028','2028'];

  creditCard: CreditCard = new CreditCard();

  formInvalid: boolean;

  isAllowedNumericKey = isAllowedNumeric;

  paymentInProgress: boolean;

  transactionalError: boolean;

  constructor(private transactionalApi: HttpWrapperTransactionalService) { }

  ngOnInit() {
  }

  setMonth(month) {
    this.creditCard.expirationMonth = month;
  }

  setYear(year) {
    this.creditCard.expirationYear = year;
  }

  pay() {
    this.formInvalid = this.ccNumberInvalid()
      || this.ccvInvalid()
      || !this.creditCard.expirationMonth
      || !this.creditCard.expirationYear
      || !this.creditCard.name
      || this.creditCard.name.length < 2;

    if (this.formInvalid) return;

    this.creditCard.expiration = `${this.creditCard.expirationMonth}/${this.creditCard.expirationYear}`;

    this.paymentInProgress = true;
    this.transactionalError = false;

    this.transactionalApi.paySixPlan(this.plan.id, this.creditCard, this.user).subscribe(response => {
      this.paymentInProgress = false;

      if (response instanceof TransactionalResponseError) {
        this.transactionalError = true;
        return;
      }

      this.paymentSuccessful.emit(true);
    })
  }

  ccNumberInvalid(): boolean {
    if (!this.creditCard.ccnumber) return true;

    return !/[0-9]/.test(this.creditCard.ccnumber) || this.creditCard.ccnumber.length < 12 || this.creditCard.ccnumber.length > 20;
  }

  ccvInvalid(): boolean {
    if (!this.creditCard.ccv) return true;

    return !/[0-9]/.test(this.creditCard.ccv) || this.creditCard.ccv.length < 3 || this.creditCard.ccv.length > 4;
  }

}
