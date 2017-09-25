import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProductsService} from "../../../shared/services/products.service";
import {Product} from "../../../shared/models/product.model";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {Modes} from '../../abstract-entity-view.component';
import {areEntitiesIdentical} from '../../../shared/utils/entity.utils';
import {YesNoDialogComponent} from '../../yes-no-dialog.component';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends AbstractEntityIndexComponent<Product> implements OnInit, OnDestroy {

  private showAddDialog: boolean;
  product: Product;
  price: string;
  modes = Modes;

  constructor(
    productsService: ProductsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(productsService, auth, dialog, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('Product Name', (e: Product) => e.name),
      new ColumnParams('SKU',(e: Product) => e.sku),
      new ColumnParams('Ship', (e: Product) => e.ship),
      new ColumnParams('Shipping Delay', (e: Product) => e.shippingDelay, 'right')
    ];
  }

  showDialog() {
    this.product = new Product();
    this.price = '';
    this.showAddDialog = true;
  }

  hideDialog() {
    if (areEntitiesIdentical(this.product, new Product())) {
      this.showAddDialog = false;
      return;
    }

    let yesNoDialogRef = this.deleteDialog.open(YesNoDialogComponent, { disableClose : true });
    yesNoDialogRef.componentInstance.text = 'Are you sure you want to leave?';
    yesNoDialogRef.componentInstance.secondaryText = 'You have unsaved changes, if you leave changes will be discarded.';
    yesNoDialogRef.componentInstance.yesText = 'Proceed';
    yesNoDialogRef.componentInstance.noText = 'Cancel';

    yesNoDialogRef.afterClosed().take(1).subscribe(result => {
      yesNoDialogRef = null;

      if (result.success) {
        this.showAddDialog = false;
      }
    });
  }

  saveProduct() {
    this.service.createEntity(this.product);
    this.showAddDialog = false;
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
