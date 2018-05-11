import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {Plan} from '../plans/plan.model';
import {CreditCard} from '../../shared/models/credit-card.model';
import {isAllowedNumeric, isShorterThan} from '../../shared/utils/form.utils';
import {HttpWrapperTransactionalService} from '../../shared/services/http-wrapper-transactional.service';
import {TransactionalResponseError} from '../../shared/models/transactional-response-error.model';
import {AclsService} from '../../shared/services/acls.service';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {UsersService} from '../../shared/services/users.service';
import {MatDialog} from '@angular/material';
import {TermsDialogComponent} from '../../dialog-modals/terms-dialog/terms-dialog.component';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AccountsService} from '../../shared/services/accounts.service';
import {Location} from '@angular/common';
import {environment} from '../../../environments/environment';
import {Bill} from '../../shared/models/bill.model';

@Component({
  selector: 'plan-payment',
  templateUrl: 'plan-payment.component.html',
  styleUrls: ['plan-payment.component.scss']
})
export class PlanPaymentComponent implements OnInit {

  @Input() plan: Plan;
  @Input() isRecurringPayment: boolean;
  @Input() creditCards: CreditCard[] = [];
  @Input() unpaidBills: Bill[] = [];

  @Output() changePlan: EventEmitter<boolean> = new EventEmitter();
  @Output() paymentSuccessful: EventEmitter<boolean> = new EventEmitter();

  months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  years = ['2018','2019','2020','2021','2022','2023','2024','2025','2026','2028','2028'];

  creditCard: CreditCard = new CreditCard();

  formInvalid: boolean;

  isAllowedNumericKey = isAllowedNumeric;
  isShorterThan = isShorterThan;

  paymentInProgress: boolean;

  transactionalError: boolean;

  ownerTerms: { version?: string, title?: string, body?: string };
  showGenericLoader = environment.branding && environment.branding.showGenericLoader;

  constructor(
    private transactionalApi: HttpWrapperTransactionalService,
    private aclService: AclsService,
    private accountService: AccountsService,
    private userService: UsersService,
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private location: Location
  ) { }

  ngOnInit() {
    this.userService.getLatestTermsAndConditions('owner').take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      this.ownerTerms = response.body.response.data.latesttermsandconditions;
    });
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

    const acl = this.authService.getActiveAcl();

    this.aclService.updateUserAclTermsAndConditions(acl, this.ownerTerms.version).take(1).subscribe(data => {
      if (data instanceof CustomServerError) {
        this.paymentInProgress = false;
        return;
      }

      acl.termsAndConditionsOutdated = false;
      this.authService.changeActiveAcl(acl, true);

      const user = this.authService.getSixUser();

      this.transactionalApi.paySixPlan(this.plan.id, this.creditCard, user).subscribe(response => {
        if (response instanceof TransactionalResponseError) {
          this.paymentInProgress = false;
          this.transactionalError = true;
          return;
        }

        if (!response.success) {
          this.paymentInProgress = false;
          this.transactionalError = true;
          return;
        }

        this.accountService.activateAccount(this.authService.getActiveAcl().account, response.session).subscribe(res => {
          if (res instanceof CustomServerError) {
            return;
          }

          this.paymentSuccessful.emit(true);
        })
      })

    });

  }

  ccNumberInvalid(): boolean {
    if (!this.creditCard.ccnumber) return true;

    return !/[0-9]/.test(this.creditCard.ccnumber) || this.creditCard.ccnumber.length < 12 || this.creditCard.ccnumber.length > 20;
  }

  ccvInvalid(): boolean {
    if (!this.creditCard.ccv) return true;

    return !/[0-9]/.test(this.creditCard.ccv) || this.creditCard.ccv.length < 3 || this.creditCard.ccv.length > 4;
  }

  openOwnerTerms() {
    if (!this.ownerTerms) return;

    this.openTerms(this.ownerTerms.title, this.ownerTerms.body);
  }

  private openTerms(title: string, text: string) {
    let ref = this.dialog.open(TermsDialogComponent, { disableClose : true });
    ref.componentInstance.title = title;
    ref.componentInstance.text = text;

    ref.afterClosed().take(1).subscribe(() => {
      ref = null;
    });
  }

  submitButtonText() {
    if (this.isRecurringPayment) {
      return 'Complete Purchase & Reactivate Account'
    } else if (this.transactionalError) {
      return 'PAYMENT_COMPLETEPURCHASE'
    } else {
      return 'PAYMENT_INFO_FINISH'
    }
  }

  paymentTitle() {
    if (this.isRecurringPayment) {
      return 'Make Payment'
    } else if (this.transactionalError) {
      return 'PAYMENT_ERRORTITLE'
    } else {
      return 'PAYMENT_TITLE'
    }
  }

  paymentSummaryText() {
    return this.isRecurringPayment ? 'PAYMENT_BALANCEDUE' : 'PAYMENT_INFO_TOTAL';
  }

  paymentInfoFirstPart() {
    return this.isRecurringPayment ? 'PAYMENT_DECLINETITLE' : 'PAYMENT_INFO_TITLE';
  }

  paymentInfoSecondPart() {
    return this.isRecurringPayment ? 'PAYMENT_DECLINEINFO' : 'PAYMENT_INFO_TIER';
  }

  cancel() {
    this.location.back();
  }
}
