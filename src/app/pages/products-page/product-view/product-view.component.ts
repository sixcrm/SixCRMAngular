import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../shared/services/products.service';
import {ActivatedRoute} from '@angular/router';
import {FulfillmentProvidersService} from '../../../shared/services/fulfillment-providers.service';
import {FulfillmentProvider} from '../../../shared/models/fulfillment-provider.model';
import {NavigationService} from '../../../navigation/navigation.service';
import {parseCurrencyMaskedValue} from '../../../shared/utils/mask.utils';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {MessageDialogComponent} from '../../message-dialog.component';
import {MdDialog} from '@angular/material';

@Component({
  selector: 'product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent extends AbstractEntityViewComponent<Product> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  fulfillmentProviderMapper = (el: FulfillmentProvider) => el.name;

  formInvalid: boolean;

  price: string = '';

  canNotBeDeleted: boolean = true;

  constructor(
    service: ProductsService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public fulfillmentProvidersService: FulfillmentProvidersService,
    private dialog: MdDialog
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    this.service.entity$.merge(this.service.entityCreated$).merge(this.service.entityUpdated$).takeUntil(this.unsubscribe$)
      .subscribe(product => {
        this.price = product instanceof CustomServerError ? '' : product.defaultPrice.amount + '';
      });

    if (this.addMode) {
      this.entity = new Product();
      this.entity.ship = 'true';
      this.entityBackup = this.entity.copy();
      this.fulfillmentProvidersService.getEntities();
    } else {
      this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe(() => this.fulfillmentProvidersService.getEntities());
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number) {
    this.selectedIndex = value;
  }

  toggleShip() {
    this.entity.ship = this.entity.ship === 'true' ? 'false' : 'true';
    if (this.entity.ship === 'true') {
      this.entity.shippingDelay = 0;
    } else {
      this.entity.shippingDelay = null;
    }
  }

  save(valid: boolean): void {
    this.formInvalid = !valid;

    if (this.formInvalid) {

    } else {
      this.entity.defaultPrice.amount = parseCurrencyMaskedValue(this.price);
      this.saveOrUpdate(this.entity);
    }
  }

  deleteProduct(): void {
    if (this.addMode) return;

    if (this.canNotBeDeleted) {
      this.showMessageDialog('You can not delete this product as long as it is associated with a product schedule.');
    } else {
      this.service.entityDeleted$.take(1).takeUntil(this.unsubscribe$).subscribe(() => {
        this.navigation.back();
      });

      this.service.deleteEntity(this.entity.id);
    }
  }

  showMessageDialog(text: string) {
    let messageDialogRef = this.dialog.open(MessageDialogComponent);
    messageDialogRef.componentInstance.text = text;

    messageDialogRef.afterClosed().take(1).subscribe(() => {
      messageDialogRef = null;
    });
  }

  setCanNotBeDeleted(entities: any[]) {
    this.canNotBeDeleted = entities && entities.length > 0;
  }

}
