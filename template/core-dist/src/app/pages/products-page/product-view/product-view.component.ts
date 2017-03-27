import { Component, OnInit } from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../shared/services/products.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent extends AbstractEntityViewComponent<Product> implements OnInit {

  constructor(service: ProductsService, route: ActivatedRoute, progressBar: ProgressBarService) {
    super(service, route, progressBar);
  }

  ngOnInit() {
    super.init();
  }

}
