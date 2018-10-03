import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {Customer} from '../../../shared/models/customer.model';
import {MatDialog} from '@angular/material';
import {AddCustomerDialogComponent} from '../../../dialog-modals/add-customer-dialog/add-customer-dialog.component';
import {CustomersService} from '../../../entity-services/services/customers.service';
import {CardSwitcherDialogComponent} from '../../../dialog-modals/card-switcher-dialog/card-switcher-dialog.component';
import {AddCreditCardDialogComponent} from '../../../dialog-modals/add-credit-card-dialog/add-credit-card-dialog.component';
import {CreditCardsService} from '../../../entity-services/services/credit-cards.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {Subscription} from 'rxjs';

@Component({
  selector: 'customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})
export class CustomerInfoComponent implements OnInit, OnDestroy {

  customerUpdateSub: Subscription;

  _customer: Customer;
  _defaultCreditCard: CreditCard;

  @Input() set customer(customer: Customer) {
    if (customer) {
      this._customer = customer.copy();
      this._defaultCreditCard = this.getDefaultCard();
    }
  };

  constructor(
    private dialog: MatDialog,
    private customerService: CustomersService,
    private creditCardService: CreditCardsService
  ) { }

  ngOnDestroy() {
    if (this.customerUpdateSub) {
      this.customerUpdateSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.customerUpdateSub = this.customerService.entityUpdated$.subscribe(customer => {
      if (customer instanceof CustomServerError || !this._customer || customer.id !== this._customer.id) return;

      this._customer = customer;
      this._defaultCreditCard = this.getDefaultCard();
    });
  }

  getDefaultCard(customer?: Customer): CreditCard {
    if (!this._customer && !customer) return null;

    const cards = customer ? customer.creditCards : this._customer.creditCards;

    for (let card of cards) {
      if (card.id === this._customer.defaultCreditCard) {
        return card.copy();
      }
    }

    return null;
  }

  editCustomer() {
    let dialogRef = this.dialog.open(AddCustomerDialogComponent, {backdropClass: 'backdrop-blue'});

    dialogRef.componentInstance.customer = this._customer.copy();
    dialogRef.componentInstance.editMode = true;

    dialogRef.afterClosed().take(1).subscribe(result => {
      dialogRef = null;

      if (result && result.customer && result.customer.id) {
        this.customerService.updateEntity(result.customer);
      }
    })
  }


  openCardSwitcher(): void {
    let dialogRef = this.dialog.open(CardSwitcherDialogComponent, {backdropClass: 'backdrop-blue'});

    const updateInstance = (customer: Customer) => {
      dialogRef.componentInstance.cards = customer.creditCards.sort((a,b) => a.createdAt.isBefore(b.createdAt) ? 1 : a.createdAt.isAfter(b.createdAt) ? -1 : 0);
      dialogRef.componentInstance.selectedDefaultCard = this.getDefaultCard(customer) || new CreditCard();
      dialogRef.componentInstance.updateEmbedded = true;
    };

    const customerUpdateSub = this.customerService.entityUpdated$.subscribe((updatedCustomer) => {
      if (updatedCustomer instanceof CustomServerError) return;

      updateInstance(updatedCustomer);
    });

    const cardUpdateSub = this.creditCardService.entityUpdated$.subscribe((updatedCreditCard) => {
      if (updatedCreditCard instanceof CustomServerError) return;

      const index = firstIndexOf(this._customer.creditCards, (el) => el.id === updatedCreditCard.id);

      if (index !== -1) {
        this._customer.creditCards[index] = updatedCreditCard.copy();
      }

      this.customerService.entityUpdated$.next(this._customer.copy());
    });

    const addSub = dialogRef.componentInstance.addCard.subscribe(() => this.openCardModal(dialogRef));
    const editSub = dialogRef.componentInstance.editCard.subscribe((card) => this.openCardModal(dialogRef, card));

    updateInstance(this._customer.copy());

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;

      if (customerUpdateSub) customerUpdateSub.unsubscribe();
      if (cardUpdateSub) cardUpdateSub.unsubscribe();
      if (addSub) addSub.unsubscribe();
      if (editSub) editSub.unsubscribe();

      if (result && result.selectedDefaultCard && result.selectedDefaultCard.id) {
        this.updateCustomerDefaultCard(result.selectedDefaultCard.id);
      }
    });
  }

  openCardModal(editDialogRef, creditCard?: CreditCard) {
    let dialogRef = this.dialog.open(AddCreditCardDialogComponent, {backdropClass: 'backdrop-none'});

    dialogRef.componentInstance.creditCard = creditCard ? creditCard.copy() : new CreditCard();
    dialogRef.componentInstance.hideDefaultCardSelection = !!creditCard;
    dialogRef.componentInstance.isDefaultCreditCard = creditCard ? this._customer.defaultCreditCard === creditCard.id : true;

    dialogRef.afterClosed().subscribe(result => {
      dialogRef = null;

      if (result && result.creditCard) {

        if (creditCard) {
          this.creditCardService.updateEntity(result.creditCard);
        } else {
          this.handleAddNewCard(result.creditCard, result.isDefaultCard);

          if (result.isDefaultCard) {
            editDialogRef.close({});
          }
        }

      }
    });
  }

  private updateCustomerDefaultCard(defaultCardId: string) {
    const updatedCustomer = this._customer.copy();
    updatedCustomer.defaultCreditCard = defaultCardId;

    this.customerService.updateEntity(updatedCustomer);
  }

  private handleAddNewCard(card: CreditCard, isDefault: boolean) {
    this.creditCardService.entityCreated$.take(1).subscribe(newCard => {
      if (newCard instanceof CustomServerError) return;

      const updatedCustomer = this._customer.copy();
      updatedCustomer.creditCards.push(newCard);

      if (isDefault) {
        updatedCustomer.defaultCreditCard = newCard.id;
      }

      this.customerService.updateEntity(updatedCustomer);
    });

    this.creditCardService.createEntity(card);
  }

}
