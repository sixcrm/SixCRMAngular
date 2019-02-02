import {Component, OnInit} from '@angular/core';
import {ProductsService} from "../../../entity-services/services/products.service";
import {Product} from "../../../shared/models/product.model";
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {utc} from 'moment';
import {ProductScheduleService} from '../../../entity-services/services/product-schedule.service';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {DeleteDialogComponent} from '../../../dialog-modals/delete-dialog.component';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {AbstractEntityService} from '../../../entity-services/services/abstract-entity.service';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  crumbItems: BreadcrumbItem[] = [{label: () => 'Products and Schedules'}];

  filterString: string;
  filterFunction = (item: any) => item.name + (item.sku || '');

  bulkOptions = ['Copy', 'Select All', 'Deselect All', 'Delete'];

  entities: (Product | ProductSchedule)[] = [];
  allEntities: (Product | ProductSchedule)[] = [];

  sortName = (order: string) => (f: (Product | ProductSchedule), s: (Product | ProductSchedule)) => {
    if ((f.name || '').toLowerCase() < (s.name || '').toLowerCase()) return order === 'asc' ? -1 : 1;
    if ((f.name || '').toLowerCase() > (s.name || '').toLowerCase()) return order === 'asc' ? 1 : -1;
    return 0;
  };

  sortPrice = (order: string) => (f: (Product | ProductSchedule), s: (Product | ProductSchedule)) => {
    let fprice = 0;
    let sprice = 0;

    if (f instanceof Product) {
      fprice = f.defaultPrice.amount;
    }

    if (s instanceof Product) {
      sprice = s.defaultPrice.amount;
    }

    if (f instanceof ProductSchedule) {
      fprice = f.getInitialPrice().amount;
    }

    if (s instanceof ProductSchedule) {
      sprice = s.getInitialPrice().amount;
    }

    if (fprice < sprice) return order === 'asc' ? -1 : 1;
    if (fprice > sprice) return order === 'asc' ? 1 : -1;

    return 0;
  };

  sortBy = [
    {label: 'Name a-z', sortFunction: this.sortName('asc')},
    {label: 'Name z-a', sortFunction: this.sortName('desc')},
    {label: 'Price $$$-$', sortFunction: this.sortPrice('desc')},
    {label: 'Price $-$$$', sortFunction: this.sortPrice('asc')}
  ];

  selectedSortBy = this.sortBy[0];

  filters = [
    {label: 'All', filterFunction: (el) => el},
    {label: 'Products', filterFunction: (el) => el instanceof Product},
    {label: 'Schedules', filterFunction: (el) => el instanceof ProductSchedule}
  ];

  selectedFilter = this.filters[0];

  constructor(
    public productsService: ProductsService,
    private schedulesService: ProductScheduleService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.productsService.entityDeleted$.merge(this.schedulesService.entityDeleted$).subscribe(entity => {
      if (entity instanceof CustomServerError) return;

      const index = firstIndexOf(this.allEntities, e => e.id === entity.id);

      if (index !== -1) {
        this.allEntities.splice(index, 1).sort(this.selectedSortBy.sortFunction);
        this.entities = this.allEntities.filter(this.selectedFilter.filterFunction);
      }
    });

    this.productsService.entities$.take(1).zip(this.schedulesService.entities$.take(1)).subscribe(data => {
      if (!data || !data[0] || data[0] instanceof CustomServerError || !data[1] || data[1] instanceof CustomServerError) {
        return;
      }

      this.allEntities = [...data[0], ...data[1]].sort(this.selectedSortBy.sortFunction);
      this.entities = this.allEntities.filter(this.selectedFilter.filterFunction);
    });

    this.productsService.getEntities();
    this.schedulesService.getEntities();
  }

  isSubscription(entity: (Product | ProductSchedule)): boolean {
    return entity instanceof ProductSchedule;
  }

  createNewProduct() {
    const newProduct = new Product({name: `New Product ${utc().format('MMM-DD')}`});

    this.productsService.fetchCreateEntity(newProduct).subscribe(product => {
      if (product instanceof CustomServerError) return;

      this.router.navigate(['/products', 'product', product.id], {queryParams: {edit: 'true'}})
    });
  }

  ngOnInit() { }

  selectEntity(entity: any): void {
    entity['bulkSelected'] = !entity['bulkSelected'];
  }

  getDefaultImagePath(entity: Product | ProductSchedule) {
    if (entity instanceof Product || entity instanceof ProductSchedule) {
      return entity.getDefaultImagePath();
    }

    return '/assets/images/product-default-image.svg';
  }

  selectAllEntities() {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i]['bulkSelected'] = true;
    }
  }

  deselectAllEntities() {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i]['bulkSelected'] = false;
    }
  }

  copySelectedEntities() {
    const toBeCopied = this.entities.filter(entity => entity['bulkSelected']);

    if (toBeCopied.length === 1) {
      this.copyEntity(toBeCopied[0], true);
    } else {
      toBeCopied.forEach(entity => {
        this.copyEntity(entity);
      });
    }
  }

  copyEntity(entity: (Product | ProductSchedule), viewAfterCopy?: boolean): void {
    const service: AbstractEntityService<any> = entity instanceof Product ? this.productsService : this.schedulesService;

    service.fetchEntity(entity.id).subscribe(full => {
      if (full instanceof CustomServerError) {
        return;
      }

      full.name = full.name + ' (Copy)';

      service.fetchCreateEntity(full).subscribe(copied => {
        if (copied instanceof CustomServerError) {
          return;
        }

        if (viewAfterCopy) {

          if (entity instanceof Product) {
            this.router.navigate(['/products', 'product', copied.id], {queryParams: {edit: true}});
          } else {
            this.router.navigate(['/products', 'schedule', copied.id], {queryParams: {edit: true}});
          }

          return;
        }

        this.allEntities = [copied, ...this.entities].sort(this.selectedSortBy.sortFunction);
        this.entities = this.allEntities.filter(this.selectedFilter.filterFunction);
      });
    });

  }

  deleteMany(entities: (Product | ProductSchedule)[]) {
    if (!entities || entities.length === 0) return;

    let ref = this.dialog.open(DeleteDialogComponent);

    ref.componentInstance.items = entities.map(e => e.name);

    ref.afterClosed().take(1).subscribe(result => {
      ref = null;

      if (result && result.success) {
        const products = entities.filter(e => e instanceof Product).map(e => e.id);
        const schedules = entities.filter(e => e instanceof ProductSchedule).map(e => e.id);

        if (schedules && schedules.length > 0) {
          this.schedulesService.deleteEntities(schedules);
        }

        if (products && products.length > 0) {
          this.productsService.deleteEntities(products);
        }
      }

    });
  }

  applySortBy(sort: {label: string, sortFunction: (f: (Product | ProductSchedule), s: (Product | ProductSchedule)) => any}) {
    this.selectedSortBy = sort;
    this.allEntities = this.allEntities.sort(sort.sortFunction);
    this.entities = this.allEntities.filter(this.selectedFilter.filterFunction)
  }

  applyFilter(filter: {label: string, filterFunction: (any) => any}) {
    this.selectedFilter = filter;
    this.entities = this.allEntities.filter(filter.filterFunction);
  }

  deleteSelectedEntities() {
    const toDelete = this.entities.filter(e => e['bulkSelected']);

    this.deleteMany(toDelete);
  }

  applyBulkOption(option: string) {
    if (!option) return;

    switch (option) {
      case 'Copy': {
        this.copySelectedEntities();
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
