import {Component, OnInit, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {Plan} from '../plans/plan.model';
import {CreditCard} from '../../shared/models/credit-card.model';
import {PaymentFormComponent} from '../../shared/components/payment-form/payment-form.component';

@Component({
  selector: 'plan-billing',
  templateUrl: 'plan-billing.component.html',
  styleUrls: ['plan-billing.component.scss']
})
export class PlanBillingComponent implements OnInit {
  @ViewChild(PaymentFormComponent) paymentForm: PaymentFormComponent;

  @Input() plan: Plan;
  @Input() creditCard: CreditCard;
  @Input() errorMessage: string;

  @Output() changePlan: EventEmitter<boolean> = new EventEmitter();
  @Output() submitCard: EventEmitter<CreditCard> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  submitCreditCard() {
    const card = this.paymentForm.getValidCreditCard();

    if (!card) return;

    this.submitCard.emit(card);
  }
}
