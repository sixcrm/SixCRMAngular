import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
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
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {isAllowedNumeric} from '../../../shared/utils/form.utils';
import {parseCurrencyMaskedValue} from '../../../shared/utils/mask.utils';

@Component({
  selector: 'product-schedule-view',
  templateUrl: './product-schedule-view.component.html',
  styleUrls: ['./product-schedule-view.component.scss']
})
export class ProductScheduleViewComponent extends AbstractEntityViewComponent<ProductSchedule> implements OnInit, OnDestroy {

  @ViewChild('endField') endField;

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
  isNumeric = isAllowedNumeric;

  formInvalid: boolean;

  price: string = '';

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
    this.price = '';
    this.scheduleToAdd = new Schedule();
  }

  addSchedule(valid: boolean): void {
    this.formInvalid = !valid || !this.scheduleToAdd.product || !this.scheduleToAdd.product.id;
    if (this.formInvalid) return;

    if (this.scheduleToAdd.end && this.scheduleToAdd.end < this.scheduleToAdd.start) {
      this.endField.nativeElement.focus();
      return;
    }

    this.service.entityUpdated$.take(1).subscribe(() => this.clearAddSchedule());

    this.scheduleToAdd.price.amount = parseCurrencyMaskedValue(this.price);
    this.entity.schedules.push(this.scheduleToAdd);

    if (!this.addMode) {
      this.updateEntity(this.entity);
    } else {
      this.entity.schedules = this.entity.schedules.slice();
      this.clearAddSchedule();
    }
  }

  disassociateSchedule(schedule: Schedule) {
    let index = firstIndexOf(this.entity.schedules, (s: Schedule) => s.id === schedule.id);

    if (index > -1) {
      this.entity.schedules.splice(index, 1);
      this.updateEntity(this.entity);
    }
  }

}
