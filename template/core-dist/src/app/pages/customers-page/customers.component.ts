import { Component, OnInit } from '@angular/core';
import {CustomersService} from "../../shared/services/customers.service";
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Customer} from '../../shared/models/customer.model';

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent extends AbstractEntityIndexComponent implements OnInit {

  private customers: Customer[] = [];

  constructor(private customersService: CustomersService, router: Router, route: ActivatedRoute) {
    super(customersService, router, route);
  }

  ngOnInit() {
    this.customersService.entities$.subscribe(customers => this.customers = customers );
    this.customersService.getEntities();
  }

}
