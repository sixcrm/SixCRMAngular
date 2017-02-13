import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {ProductScheduleService} from '../../../shared/services/product-schedule.service';
import {Subscription} from 'rxjs';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../shared/services/products.service';
import {Schedule} from '../../../shared/models/schedule.model';

@Component({
  selector: 'c-product-schedule-view',
  templateUrl: './product-schedule-view.component.html',
  styleUrls: ['./product-schedule-view.component.scss']
})
export class ProductScheduleViewComponent extends AbstractEntityViewComponent<ProductSchedule> implements OnInit, OnDestroy {

  private products: Product[] = [];
  private productsSubscription: Subscription;

  constructor(
    private productScheduleService: ProductScheduleService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService,
    private productsService: ProductsService
  ) {
    super(productScheduleService, route, progressBarService);
  }

  ngOnInit(): void {
    this.init();

    if (this.addMode) {
      this.entity = new ProductSchedule();
      this.entity.id = Math.random() + '';
      this.addNewSchedule();
    }

    if (this.addMode || this.updateMode) {
      this.productsSubscription = this.productsService.entities$.subscribe((products: Product[]) => {
        this.products = products;

        if (this.addMode) {
          this.progressBarService.hideTopProgressBar();
        }
      });
      this.productsService.getEntities();
      if (this.addMode) {
        this.progressBarService.showTopProgressBar();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }

    this.destroy();
  }

  addNewSchedule(): void {
    this.entity.schedules.push(new Schedule());
  }

  setProductToSchedule(product: Product, schedule: Schedule): void {
    schedule.product = product;
  }

}
