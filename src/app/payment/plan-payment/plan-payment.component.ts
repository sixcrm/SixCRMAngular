import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Plan} from '../plans/plan.model';
import {CreditCard} from '../../shared/models/credit-card.model';
import {UsersService} from '../../entity-services/services/users.service';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {HttpWrapperTransactionalService} from '../../shared/services/http-wrapper-transactional.service';
import {AclsService} from '../../entity-services/services/acls.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AccountsService} from '../../entity-services/services/accounts.service';
import {MatDialog} from '@angular/material';
import {TransactionalResponseError} from '../../shared/models/transactional-response-error.model';
import {TermsDialogComponent} from '../../dialog-modals/terms-dialog/terms-dialog.component';
import {NavigationService} from '../../navigation/navigation.service';

@Component({
  selector: 'plan-payment',
  templateUrl: './plan-payment.component.html',
  styleUrls: ['./plan-payment.component.scss']
})
export class PlanPaymentComponent implements OnInit {

  @Input() plan: Plan;
  @Input() creditCard: CreditCard = new CreditCard();

  @Output() changeCreditCard: EventEmitter<boolean> = new EventEmitter();
  @Output() changePlan: EventEmitter<boolean> = new EventEmitter();

  ownerTerms: { version?: string, title?: string, body?: string };

  transactionalError: boolean;
  generalError: boolean;

  constructor(
    private userService: UsersService,
    private transactionalApi: HttpWrapperTransactionalService,
    private aclService: AclsService,
    private accountService: AccountsService,
    private dialog: MatDialog,
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

  pay() {
    if (!this.creditCard) return;

    const acl = this.authService.getActiveAcl();

    this.navigationService.setShowProcessingOrderOverlay(true);

    this.aclService.updateUserAclTermsAndConditions(acl, this.ownerTerms.version).take(1).subscribe(data => {
      if (data instanceof CustomServerError) {
        this.navigationService.setShowProcessingOrderOverlay(false);
        this.transactionalError = false;
        this.generalError = true;
        return;
      }

      acl.termsAndConditionsOutdated = false;
      this.authService.changeActiveAcl(acl, true);

      const user = this.authService.getSixUser();

      this.transactionalApi.paySixPlan(this.plan.id, this.creditCard, user).subscribe(response => {
        if (response instanceof TransactionalResponseError) {
          this.transactionalError = false;
          this.generalError = true;
          this.navigationService.setShowProcessingOrderOverlay(false);
          return;
        }

        if (!response.success) {
          this.transactionalError = true;
          this.generalError = false;
          this.navigationService.setShowProcessingOrderOverlay(false);
          return;
        }

        this.accountService.activateAccount(this.authService.getActiveAcl().account, response.session).subscribe(res => {
          if (res instanceof CustomServerError) {
            this.generalError = true;
            this.navigationService.setShowProcessingOrderOverlay(false);
            return;
          }

          this.accountPaymentFinished();
        })
      })

    });

  }

  paymentErrorMessage() {
    if (this.transactionalError) {
      return 'PAYMENT_ERRORMESSAGE'
    } else if (this.generalError) {
      return 'PAYMENT_GENERALERRORINFO'
    }
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

  accountPaymentFinished() {
    this.authService.getUserIntrospection({}, '/dashboard?w=true');

    this.navigationService.setShowProcessingOrderOverlay(false);
  }
}
