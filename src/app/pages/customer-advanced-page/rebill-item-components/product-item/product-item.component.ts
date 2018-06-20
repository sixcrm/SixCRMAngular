import {Component, OnInit, Input} from '@angular/core';
import {Products} from '../../../../shared/models/products.model';
import {Product} from '../../../../shared/models/product.model';
import {MatDialog} from '@angular/material';
import {ProductDetailsDialogComponent} from '../../../../dialog-modals/product-details-dialog/product-details-dialog.component';
import {ProductsService} from '../../../../entity-services/services/products.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {

  @Input() product: Products;

  constructor(private dialog: MatDialog, private productsService: ProductsService) { }

  ngOnInit() {
  }

  showProductDetails() {
    let ref = this.dialog.open(ProductDetailsDialogComponent, {backdropClass: 'backdrop-blue'});

    ref.afterClosed().subscribe(() => {
      ref = null;
    });

    if (this.product.product.id) {
      this.productsService.entity$.take(1).subscribe(product => {
        if (product instanceof CustomServerError) {
          if (ref) {
            ref.close();
          }

          return;
        }

        if (ref) {
          ref.componentInstance.product = product;
        }

      });

      this.productsService.getEntity(this.product.product.id);
    } else {
      ref.componentInstance.product = this.product.product;
    }
  }

}
