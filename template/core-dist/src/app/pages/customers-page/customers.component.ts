import { Component, OnInit } from '@angular/core';
import {CustomersService} from "../../shared/services/customers.service";
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Customer} from '../../shared/models/customer.model';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent extends AbstractEntityIndexComponent<Customer> implements OnInit {

  constructor(
    private customersService: CustomersService,
    router: Router,
    route: ActivatedRoute,
    dialog: MdDialog,
    progressBarService: ProgressBarService
  ) {
    super(customersService, router, route, dialog, progressBarService);
  }

  ngOnInit() {
    this.customersService.entityDeleted$.subscribe((data) => this.customersService.getEntities());

    this.init();
  }

}
