import { Component, OnInit } from '@angular/core';
import {CustomersService} from "../../shared/services/customers.service";

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  constructor(private customersService: CustomersService) { }

  ngOnInit() {
  }

}
