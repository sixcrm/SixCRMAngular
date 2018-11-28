import {Component, OnInit, OnDestroy} from '@angular/core';
import {Location} from '@angular/common';
import {ProductsService} from "../../../entity-services/services/products.service";
import {Product} from "../../../shared/models/product.model";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {MatDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {utc} from 'moment';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends AbstractEntityIndexComponent<Product> implements OnInit, OnDestroy {

  sortBy = [
    {label: 'Name', sortFunction: (f: Product, s: Product) => {
      if ((f.name || '').toLowerCase() < (s.name || '').toLowerCase()) return -1;
      if ((f.name || '').toLowerCase() > (s.name || '').toLowerCase()) return 1;
      return 0;
    }},
    {label: 'Price', sortFunction: (f: Product, s: Product) => {
      if (f.defaultPrice.amount < s.defaultPrice.amount) return -1;
      if (f.defaultPrice.amount > s.defaultPrice.amount) return 1;
      return 0;
    }},
    {label: 'Created At', sortFunction: (f: Product, s: Product) => {
      if (f.createdAt.isBefore(s.createdAt)) return -1;
      if (f.createdAt.isAfter(s.createdAt)) return 1;
      return 0;
    }}
  ];

  crumbItems: BreadcrumbItem[] = [{label: () => 'Products'}];

  filterString: string;
  filterFunction = (product: Product) => product.name;

  bulkOptions = ['Copy', 'Select All', 'Deselect All', 'Delete'];

  constructor(
    productsService: ProductsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    location: Location
  ) {
    super(productsService, auth, dialog, paginationService, router, activatedRoute, location);

    this.entityFactory = () => new Product();
    this.entityNameFunction = (p: Product) => p.name;
    this.openInEditModeAfterCreation = true;
  }

  openAddMode() {
    const newProduct = new Product({name: `New Product ${utc().format('MMM-DD')}`});

    this.createEntity(newProduct);
  }

  ngOnInit() {
    this.setInfiniteScroll(true);
    this.shareLimit = false;
    this.limit = 100;
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  applyBulkOption(option: string) {
    if (!option) return;

    switch (option) {
      case 'Copy': {
        this.copySelectedEntities((p: Product) => {
          p.name = p.name + ' Copy';

          return p
        });

        break;
      }
      case 'Select All': {
        this.selectAllEntities();
        break;
      }
      case 'Deselect All': {
        this.deselectAllEntities();
        break;
      }
      case 'Delete': {
        this.deleteSelectedEntities();
        break;
      }
    }
  }
}
