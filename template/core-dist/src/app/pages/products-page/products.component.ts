import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../../shared/services/products.service";
import {Product} from "../../shared/models/product.model";
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {Router, ActivatedRoute} from '@angular/router';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends AbstractEntityIndexComponent<Product> implements OnInit {

  constructor(
    private productsService: ProductsService,
    router: Router,
    route: ActivatedRoute,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(productsService, router, route, dialog, progressBarService, paginationService);
  }

  ngOnInit() {
    this.productsService.entityDeleted$.subscribe((data) => this.productsService.getEntities());

    this.init();
  }
}
