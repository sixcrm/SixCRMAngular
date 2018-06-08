import {Component, Input, OnInit} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {Product} from '../../../shared/models/product.model';

@Component({
  selector: 'rebill-item',
  templateUrl: './rebill-item.component.html',
  styleUrls: ['./rebill-item.component.scss']
})
export class RebillItemComponent implements OnInit {

  @Input() rebill: Rebill;

  showTransactions: boolean;
  showTracking: boolean;

  constructor() { }

  ngOnInit() {
  }

  calculateCycle() {
    return 0;
  }

  getProductImage(product: Product) {
    return product.getDefaultImage() ? product.getDefaultImage().path : null;
  }

  toggleTransactions() {
    this.showTransactions = !this.showTransactions;
  }

  toggleShipping() {
    this.showTracking = !this.showTracking;
  }

  hasShippingReceipt() {
    return this.rebill && this.rebill.shippingReceipts && this.rebill.shippingReceipts.length > 0;
  }
}
