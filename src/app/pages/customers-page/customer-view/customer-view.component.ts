import {Component, OnInit, OnDestroy} from '@angular/core';
import {Customer} from '../../../shared/models/customer.model';
import {CustomersService} from '../../../shared/services/customers.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {NavigationService} from '../../../navigation/navigation.service';
import {conformToMask} from 'angular2-text-mask';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {Rebill} from '../../../shared/models/rebill.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {getPhoneNumberMask} from '../../../shared/utils/mask.utils';
import {getStates} from '../../../shared/utils/address.utils';

@Component({
  selector: 'customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})
export class CustomerViewComponent extends AbstractEntityViewComponent<Customer> implements OnInit, OnDestroy {
  selectedIndex: number = 0;

  mask = getPhoneNumberMask();

  creditCardInputMode: boolean = false;
  creditCardForInput: CreditCard;

  customerInfoEditMode: boolean = false;

  rebillEditMode: boolean = false;
  rebillUnderEdit: Rebill;

  states: string[] = getStates();

  formInvalid: boolean = false;

  constructor(
    service: CustomersService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public authService: AuthenticationService
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe(() => {
      this.customerInfoEditMode = false;
    });

    if (this.addMode) {
      this.entity = new Customer();
      this.entityBackup = this.entity.copy();
    }
  }

  getPhoneNumber(): string {
    if (!this.entity || !this.entity.phone) return '';

    return conformToMask(this.entity.phone, this.mask, {guide: false}).conformedValue;
  }

  ngOnDestroy() {
    this.destroy();
  }

  cancelAddressUpdate() {
    this.cancelUpdate();
  }

  cancelInfoUpdate() {
    this.customerInfoEditMode = false;
    this.cancelUpdate();
  }

  setIndex(index: number): void {
    this.selectedIndex = index;
  }

  addNewCreditCard(): void {
    this.creditCardInputMode = true;
    this.creditCardForInput = new CreditCard();
  }

  editCreditCard(creditCard: CreditCard): void {
    this.creditCardInputMode = true;
    this.creditCardForInput = creditCard.copy();
  }

  deleteCreditCard(ccard: CreditCard): void {
    this.removeCreditCardLocally(ccard);
    this.cancelCreditCardInput();
    this.service.updateEntity(this.entity);
  }

  cancelCreditCardInput(): void {
    this.creditCardInputMode = false;
    this.creditCardForInput = null;
  }

  creditCardUpdated(ccard: CreditCard): void {
    this.cancelCreditCardInput();
    this.updateCreditCardLocally(ccard);
  }

  creditCardCreated(ccard: CreditCard): void {
    this.entity.creditCards.push(ccard);
    this.cancelCreditCardInput();
    this.service.updateEntity(this.entity);
  }

  updateCreditCardLocally(ccard: CreditCard): void {
    let index = firstIndexOf(this.entity.creditCards, el => el.id === ccard.id);

    if (index >= 0) {
      this.entity.creditCards[index] = ccard;
    }
  }

  removeCreditCardLocally(ccard: CreditCard): void {
    let index = firstIndexOf(this.entity.creditCards, el => el.id === ccard.id);

    if (index >= 0) {
      this.entity.creditCards.splice(index, 1);
    }
  }

  editRebillMode(rebill: Rebill): void {
    this.rebillUnderEdit = rebill;
    this.rebillEditMode = true;
  }

  cancelRebillMode(): void {
    this.rebillEditMode = false;
  }

  displayCreatedAt(): boolean {
    return this.entity.createdAt.clone().isSame(this.entity.updatedAt);
  }

  saveCustomer(formValid) {
    this.formInvalid = !formValid || !this.entity.address.country || !this.entity.address.state;
    if (this.formInvalid) return;

    this.saveOrUpdate(this.entity);
  }
}
