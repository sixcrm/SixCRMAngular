import { Component, OnInit } from '@angular/core';
import {AbstractEntityComponent} from '../../abstract-entity-component';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../shared/services/products.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent extends AbstractEntityComponent<Product> implements OnInit {

  private showFulfillmentProviderDetails: boolean = true

  constructor(service: ProductsService, progressBarService?: ProgressBarService) {
    super(service, progressBarService);
  }

  ngOnInit() {
    this.init();
  }

  toggleFulfillmentProviderDetails(): void {
    this.showFulfillmentProviderDetails = !this.showFulfillmentProviderDetails;
  }

}
