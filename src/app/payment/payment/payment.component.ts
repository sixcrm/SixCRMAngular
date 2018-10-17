import {Component, OnInit} from '@angular/core';
import {Plan} from '../plans/plan.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Acl} from '../../shared/models/acl.model';
import {environment} from '../../../environments/environment';
import {CreditCard} from '../../shared/models/credit-card.model';
import {NavigationService} from '../../navigation/navigation.service';
import {AccountsService} from '../../entity-services/services/accounts.service';
import {AclsService} from '../../entity-services/services/acls.service';
import {HttpWrapperTransactionalService} from '../../shared/services/http-wrapper-transactional.service';
import {UsersService} from '../../entity-services/services/users.service';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {TransactionalResponseError} from '../../shared/models/transactional-response-error.model';
import {TermsDialogComponent} from '../../dialog-modals/terms-dialog/terms-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  planInProgress: boolean = true;
  paymentInProgress: boolean;
  confirmationInProgress: boolean;

  plan: Plan;
  mapAcl = (acl: Acl) => acl.account.name;

  sidenavLogo = environment.branding ? environment.branding.sidenavLogo : 'logo-white.svg';
  creditCard: CreditCard = new CreditCard();

  ownerTerms: { version?: string, title?: string, body?: string };
  errorMessage: string;

  constructor(
    public authService: AuthenticationService,
    private transactionalApi: HttpWrapperTransactionalService,
    private aclService: AclsService,
    private accountService: AccountsService,
    private navigationService: NavigationService,
    private userService: UsersService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userService.getlatestTermsAndConditions(this.authService.getActiveAcl().account.id, 'owner').take(1).subscribe((response) => {
      if (response instanceof CustomServerError) {
        return;
      }

      this.ownerTerms = response.body.response.data.latesttermsandconditions;
    });
  }

  setSelectedPlan(plan: Plan) {
    this.plan = plan;
    this.setPaymentInProgress();
  }

  submitCard(card: CreditCard) {
    this.creditCard = card;
    this.setConfirmationInProgress();
  }

  setPaymentInProgress() {
    this.planInProgress = false;
    this.paymentInProgress = true;
    this.confirmationInProgress = false;
  }

  setPlanInProgress() {
    this.planInProgress = true;
    this.paymentInProgress = false;
    this.confirmationInProgress = false;
  }

  setConfirmationInProgress() {
    this.planInProgress = false;
    this.paymentInProgress = false;
    this.confirmationInProgress = true;
  }

  changeAcl(acl: Acl) {
    this.authService.changeActiveAcl(acl);
  }

  signout() {
    this.authService.logout();
  }

  pay() {
    if (!this.creditCard) return;

    const acl = this.authService.getActiveAcl();

    this.navigationService.setShowProcessingOrderOverlay(true);

    this.aclService.updateUserAclTermsAndConditions(acl, this.ownerTerms.version).take(1).subscribe(data => {
      if (data instanceof CustomServerError) {
        this.errorMessage = 'There was a problem processing your request, please contact the site administrator';
        this.setPaymentInProgress();
        this.navigationService.setShowProcessingOrderOverlay(false);
        return;
      }

      acl.termsAndConditionsOutdated = false;
      this.authService.changeActiveAcl(acl, true);

      const user = this.authService.getSixUser();

      this.transactionalApi.paySixPlan(this.plan.id, this.creditCard, user).subscribe(response => {
        if (response instanceof TransactionalResponseError) {
          this.errorMessage = 'There was a problem processing your request, please contact the site administrator';
          this.setPaymentInProgress();
          this.navigationService.setShowProcessingOrderOverlay(false);
          return;
        }

        if (!response.success) {
          const message = response.orders[0].transactions[0].processorResponse.body.toUpperCase() || 'Please check your card information and try again or use a different card'
          this.errorMessage = `Payment Declined: ${message}`;
          this.setPaymentInProgress();
          this.navigationService.setShowProcessingOrderOverlay(false);
          return;
        }

        this.accountService.activateAccount(this.authService.getActiveAcl().account, response.session).subscribe(res => {
          if (res instanceof CustomServerError) {
            this.errorMessage = 'There was a problem processing your request, please contact the site administrator';
            this.setPaymentInProgress();
            this.navigationService.setShowProcessingOrderOverlay(false);
            return;
          }

          this.accountPaymentFinished();
        })
      })

    });

  }

  openTermsModal() {
    let ref = this.dialog.open(TermsDialogComponent);
    ref.componentInstance.title = this.ownerTerms.title;
    ref.componentInstance.text = this.ownerTerms.body;

    ref.afterClosed().take(1).subscribe(() => {
      ref = null;
    });
  }

  accountPaymentFinished() {
    this.authService.getUserIntrospection({}, '/dashboard?w=true');

    this.navigationService.setShowProcessingOrderOverlay(false);
  }
}
