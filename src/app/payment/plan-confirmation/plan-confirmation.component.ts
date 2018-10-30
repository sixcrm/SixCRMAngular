import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Plan} from '../plans/plan.model';
import {CreditCard} from '../../shared/models/credit-card.model';
import {User} from '../../shared/models/user.model';
import {AuthenticationService} from '../../authentication/authentication.service';

@Component({
  selector: 'plan-confirmation',
  templateUrl: './plan-confirmation.component.html',
  styleUrls: ['./plan-confirmation.component.scss']
})
export class PlanConfirmationComponent implements OnInit {

  @Input() card: CreditCard;
  @Input() plan: Plan;

  @Output() issuePayment: EventEmitter<boolean> = new EventEmitter();
  @Output() changeCard: EventEmitter<boolean> = new EventEmitter();
  @Output() changePlan: EventEmitter<boolean> = new EventEmitter();
  @Output() viewTerms: EventEmitter<boolean> = new EventEmitter();

  user: User;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.user = this.authService.getSixUser();
  }

}
