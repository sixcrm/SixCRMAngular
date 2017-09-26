import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Product} from '../../../../shared/models/product.model';
import {Modes} from '../../../abstract-entity-view.component';
import {FulfillmentProvider} from '../../../../shared/models/fulfillment-provider.model';
import {FulfillmentProvidersService} from '../../../../shared/services/fulfillment-providers.service';
import {parseCurrencyMaskedValue, getCurrencyMask} from '../../../../shared/utils/mask.utils';
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
  @Input() price: string;
  @Output() save: EventEmitter<Product> = new EventEmitter();
  @Output() deleteEntity: EventEmitter<Product> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  add = Modes.Add;
  update = Modes.Update;
  view = Modes.View;
  numberMask = getCurrencyMask();
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

  toggleShip() {
    this.entity.ship = this.entity.ship === 'true' ? 'false' : 'true';
    if (this.entity.ship === 'true') {
      this.entity.shippingDelay = 0;
    } else {
      this.entity.shippingDelay = null;
    }
  }

  saveProduct(valid: boolean): void {
    this.formInvalid = !valid;

    if (this.formInvalid) return;

    this.entity.defaultPrice = new Currency(parseCurrencyMaskedValue(this.price));
    this.save.emit(this.entity);
  }
}
