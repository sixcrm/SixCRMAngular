import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProductsService} from "../../../shared/services/products.service";
import {Product} from "../../../shared/models/product.model";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {ProductScheduleService} from '../../../shared/services/product-schedule.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {
  productScheduleListQuery,
  productSchedulesByProduct
} from '../../../shared/utils/queries/entities/product-schedule.queries';
import {MessageDialogComponent} from '../../message-dialog.component';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends AbstractEntityIndexComponent<Product> implements OnInit, OnDestroy {

  constructor(
    productsService: ProductsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    private productScheduleService: ProductScheduleService
  ) {
    super(productsService, auth, dialog, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('Product Name', (e: Product) => e.name),
      new ColumnParams('SKU',(e: Product) => e.sku),
      new ColumnParams('Ship', (e: Product) => e.ship),
      new ColumnParams('Shipping Delay', (e: Product) => e.shippingDelay, 'right')
    ];
  }

  deleteEntity(id: string) {
    this.productScheduleService.indexQuery = (limit?:number, cursor?:string) => productSchedulesByProduct(id, limit, cursor);

    this.productScheduleService.entities$.take(1).takeUntil(this.unsubscribe$).subscribe(schedules => {
      if (schedules instanceof CustomServerError) return;

      if (schedules && schedules.length > 0) {
        this.showMessageDialog('You can not delete this product as long as it is associated with a product schedule.');
      } else {
        super.deleteEntity(id);
      }
    });
    this.productScheduleService.getEntities();
  }

  showMessageDialog(text: string) {
    let messageDialogRef = this.deleteDialog.open(MessageDialogComponent);
    messageDialogRef.componentInstance.text = text;

    messageDialogRef.afterClosed().take(1).subscribe(() => {
      messageDialogRef = null;
    });
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.productScheduleService.indexQuery = productScheduleListQuery;

    this.destroy();
  }
}
