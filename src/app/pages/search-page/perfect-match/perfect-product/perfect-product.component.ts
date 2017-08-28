import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractPerfectMatch} from '../abstract-perfect-match.component';
import {Product} from '../../../../shared/models/product.model';
import {ProductsService} from '../../../../shared/services/products.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'perfect-product',
  templateUrl: './perfect-product.component.html',
  styleUrls: ['./perfect-product.component.scss']
})
export class PerfectProductComponent extends AbstractPerfectMatch implements OnInit, OnDestroy {

  product: Product;

  constructor(private productsService: ProductsService) {
    super();
  }

  ngOnInit() {
    this.productsService.entity$.takeUntil(this.unsubscribe$).subscribe(product => {
      if (product instanceof CustomServerError) {
        this.serverError = product;
        return;
      }

      this.serverError = null;
      this.product = product
    });

    this.productsService.getEntity(this.id);
  }

  ngOnDestroy() {
    this.destroy();
  }

}
