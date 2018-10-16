import {Component, OnInit, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {Plan} from '../plans/plan.model';
import {CreditCard} from '../../shared/models/credit-card.model';
import {PaymentFormComponent} from '../../shared/components/payment-form/payment-form.component';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {UsersService} from '../../entity-services/services/users.service';
import {HttpWrapperTransactionalService} from '../../shared/services/http-wrapper-transactional.service';
import {AclsService} from '../../entity-services/services/acls.service';
import {AccountsService} from '../../entity-services/services/accounts.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {NavigationService} from '../../navigation/navigation.service';
import {TransactionalResponseError} from '../../shared/models/transactional-response-error.model';

@Component({
  selector: 'plan-billing',
  templateUrl: 'plan-billing.component.html',
  styleUrls: ['plan-billing.component.scss']
})
export class PlanBillingComponent implements OnInit {
  @ViewChild(PaymentFormComponent) paymentForm: PaymentFormComponent;

  @Input() plan: Plan;

  @Output() changePlan: EventEmitter<boolean> = new EventEmitter();

  ownerTerms: { version?: string, title?: string, body?: string };
  creditCard: CreditCard = new CreditCard();

  errorMessage: string;

  constructor(
    private userService: UsersService,
    private transactionalApi: HttpWrapperTransactionalService,
    private aclService: AclsService,
    private accountService: AccountsService,
    private authService: AuthenticationService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.userService.getlatestTermsAndConditions(this.authService.getActiveAcl().account.id, 'owner').take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      this.ownerTerms = response.body.response.data.latesttermsandconditions;
    });
  }

  submitCreditCard() {
    const card = this.paymentForm.getValidCreditCard();

    if (!card) return;

    this.creditCard = card;

    this.pay();
  }

  pay() {
    if (!this.creditCard) return;

    const acl = this.authService.getActiveAcl();

    this.navigationService.setShowProcessingOrderOverlay(true);

    this.aclService.updateUserAclTermsAndConditions(acl, this.ownerTerms.version).take(1).subscribe(data => {
      if (data instanceof CustomServerError) {
        this.navigationService.setShowProcessingOrderOverlay(false);
        this.errorMessage = 'There was a problem processing your request, please contact the site administrator';
        return;
      }

      acl.termsAndConditionsOutdated = false;
      this.authService.changeActiveAcl(acl, true);

      const user = this.authService.getSixUser();

      this.transactionalApi.paySixPlan(this.plan.id, this.creditCard, user).subscribe(response => {
        if (response instanceof TransactionalResponseError) {
          this.errorMessage = 'There was a problem processing your request, please contact the site administrator';
          this.navigationService.setShowProcessingOrderOverlay(false);
          return;
        }

        if (!response.success) {
          const message = response.orders[0].transactions[0].processorResponse.body.toUpperCase() || 'Please check your card information and try again or use a different card'
          this.errorMessage = `Payment Declined: ${message}`;
          this.navigationService.setShowProcessingOrderOverlay(false);
          return;
        }

        this.accountService.activateAccount(this.authService.getActiveAcl().account, response.session).subscribe(res => {
          if (res instanceof CustomServerError) {
            this.errorMessage = 'There was a problem processing your request, please contact the site administrator';
            this.navigationService.setShowProcessingOrderOverlay(false);
            return;
          }

          this.accountPaymentFinished();
        })
      })

    });

  }

  accountPaymentFinished() {
    this.authService.getUserIntrospection({}, '/dashboard?w=true');

    this.navigationService.setShowProcessingOrderOverlay(false);
  }
}
