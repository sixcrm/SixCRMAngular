import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractPerfectMatch} from '../abstract-perfect-match.component';
import {Product} from '../../../../shared/models/product.model';
import {ProductsService} from '../../../../shared/services/products.service';

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
    this.productsService.entity$.takeUntil(this.unsubscribe$).subscribe(product => this.product = product);

    this.productsService.getEntity(this.id);
  }

  ngOnDestroy() {
    this.destroy();
  }

}
