import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProductScheduleService} from '../../../shared/services/product-schedule.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {NavigationService} from '../../../navigation/navigation.service';
import {Schedule} from '../../../shared/models/schedule.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ProductsService} from '../../../shared/services/products.service';
import {Product} from '../../../shared/models/product.model';
import {firstIndexOf} from '../../../shared/utils/array-utils';

@Component({
  selector: 'product-schedule-view',
  templateUrl: './product-schedule-view.component.html',
  styleUrls: ['./product-schedule-view.component.scss']
})
export class ProductScheduleViewComponent extends AbstractEntityViewComponent<ProductSchedule> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  scheduleColumnParams = [
    new ColumnParams('Name', (e: Schedule) => e.product.name),
    new ColumnParams('Price', (e: Schedule) => e.price.usd(), 'right'),
    new ColumnParams('Start', (e: Schedule) => e.start, 'right'),
    new ColumnParams('End', (e: Schedule) => e.end, 'right'),
    new ColumnParams('Period', (e: Schedule) => e.period, 'right'),
    new ColumnParams('Ship', (e: Schedule) => e.product.ship)
  ];

  scheduleToAdd: Schedule = new Schedule();
  scheduleMapper = (s: Schedule) => s.product.name;

  productMapper = (p: Product) => p.name;

  constructor(
    service: ProductScheduleService,
    route: ActivatedRoute,
    progressBar: ProgressBarService,
    public navigation: NavigationService,
    public authService: AuthenticationService,
    public productsService: ProductsService
  ) {
    super(service, route, progressBar);
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new ProductSchedule();
      this.entityBackup = new ProductSchedule();
      this.productsService.getEntities();
    }

    this.service.entity$.take(1).subscribe(() => this.productsService.getEntities())
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }

  clearAddSchedule(): void {
    this.scheduleToAdd = new Schedule();
  }

  addSchedule(): void {
    this.entity.schedules.push(this.scheduleToAdd);

    this.service.entityUpdated$.take(1).subscribe(() => this.clearAddSchedule());
    this.updateEntity(this.entity);
  }

  disassociateSchedule(schedule: Schedule) {
    let index = firstIndexOf(this.entity.schedules, (s: Schedule) => s.id === schedule.id);

    if (index > -1) {
      this.entity.schedules.splice(index, 1);
      this.updateEntity(this.entity);
    }
  }

  isAllowedNumeric(event): boolean {
    const pattern = /[0-9]|Backspace|ArrowRight|ArrowLeft/;

    if (!pattern.test(event.key)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

}
