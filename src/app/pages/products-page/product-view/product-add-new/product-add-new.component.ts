import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Product} from '../../../../shared/models/product.model';
import {Modes} from '../../../abstract-entity-view.component';
import {FulfillmentProvider} from '../../../../shared/models/fulfillment-provider.model';
import {FulfillmentProvidersService} from '../../../../shared/services/fulfillment-providers.service';
import {Currency} from '../../../../shared/utils/currency/currency';
import {isAllowedCurrency, isAllowedNumeric} from '../../../../shared/utils/form.utils';
import {AsyncSubject} from 'rxjs';

@Component({
  selector: 'product-add-new',
  templateUrl: './product-add-new.component.html',
  styleUrls: ['./product-add-new.component.scss']
})
export class ProductAddNewComponent implements OnInit, OnDestroy {

  @Input() entity: Product;
  @Input() mode: Modes;
  @Output() save: EventEmitter<Product> = new EventEmitter();
  @Output() deleteEntity: EventEmitter<Product> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  add = Modes.Add;
  update = Modes.Update;
  view = Modes.View;
  isCurrency = isAllowedCurrency;
  isNumeric = isAllowedNumeric;

  fulfillmentProviderMapper = (el: FulfillmentProvider) => el.name;
  formInvalid: boolean;

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(public fulfillmentProviderService: FulfillmentProvidersService) { }

  ngOnInit() {
    this.fulfillmentProviderService.getEntities();
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  toggleDynamic() {
    this.entity.dynamicPrice.enabled = !this.entity.dynamicPrice.enabled;
    this.entity.dynamicPrice.min = new Currency(0);
    this.entity.dynamicPrice.max = new Currency(0);
  }

  toggleShip() {
    this.entity.ship = !this.entity.ship;
    this.entity.shippingDelay = 0;

    if (!this.entity.ship) {
      this.entity.fulfillmentProvider = new FulfillmentProvider();
    }
  }

  saveProduct(valid: boolean): void {
    this.formInvalid = !valid || (this.entity.ship && (!this.entity.fulfillmentProvider || !this.entity.fulfillmentProvider.id)) || this.dynamicInvalid();

    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

  dynamicInvalid(): boolean {
    if (!this.entity.dynamicPrice.enabled) return false;

    return this.entity.dynamicPrice.min.amount > this.entity.dynamicPrice.max.amount;
  }

  cancelUpdate(): void {
    this.cancel.emit(true);

    this.entity.defaultPrice = new Currency(this.entity.defaultPrice.amount);
  }

  priceUpdated(currency: Currency): void {
    this.entity.defaultPrice = currency;
  }
}
