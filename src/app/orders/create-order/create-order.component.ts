import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {CustomersService} from '../../shared/services/customers.service';
import {ProductsService} from '../../shared/services/products.service';
import {ProductScheduleService} from '../../shared/services/product-schedule.service';
import {CreditCardsService} from '../../shared/services/credit-cards.service';

@Component({
  selector: 'create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private customerService: CustomersService,
    private creditCardService: CreditCardsService,
    private productsService: ProductsService,
    private productScheduleService: ProductScheduleService
  ) { }

  ngOnInit() {
  }

}
