import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'customer-service-order',
  templateUrl: './customer-service-order.component.html',
  styleUrls: ['./customer-service-order.component.scss']
})
export class CustomerServiceOrderComponent implements OnInit {

  @Input() customerId: string;

  selectedIndex: number = 0;

  constructor() { }

  ngOnInit() {
  }

  setIndex(index: number) {
    this.selectedIndex = index;
  }

}
