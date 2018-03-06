import {Component, OnInit, ViewChild, Output, Input, EventEmitter} from '@angular/core';
import {Schedule} from '../../models/schedule.model';
import {Product} from '../../models/product.model';
import {ProductsService} from '../../services/products.service';
import {isAllowedCurrency, isAllowedNumeric, isAllowedFloatNumeric} from '../../utils/form.utils';
import {ProductSchedule} from '../../models/product-schedule.model';
import {ProductScheduleService} from '../../services/product-schedule.service';

@Component({
  selector: 'add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.scss']
})
export class AddScheduleComponent implements OnInit {

  @ViewChild('endField') endField;

  isNumeric = isAllowedNumeric;
  isCurrency = isAllowedCurrency;
  isFloatNumeric = isAllowedFloatNumeric;

  productMapper = (p: Product) => p.name;

  formInvalid: boolean;

  @Input() addProductMode: boolean = true;
  @Input() editMode: boolean = false;
  @Input() productId: string;
  @Input() scheduleToAdd: Schedule = new Schedule();
  @Input() productScheduleToAdd: ProductSchedule = new ProductSchedule();

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() addSchedule: EventEmitter<Schedule> = new EventEmitter();
  @Output() addProductSchedule: EventEmitter<ProductSchedule> = new EventEmitter();

  constructor(public productsService: ProductsService, public productScheduleService: ProductScheduleService) { }

  ngOnInit() {
    if (this.addProductMode) {
      this.productsService.getEntities();
    } else {
      this.productScheduleService.getEntities();
    }
  }

  clearAddScheduleWithLoop(): void {
    let loopProduct = this.scheduleToAdd ? this.scheduleToAdd.product : new Product();

    this.scheduleToAdd = new Schedule();
    this.scheduleToAdd.product = loopProduct.copy();

    this.cancel.emit(true);
  }

  clearAddSchedule(): void {
    this.scheduleToAdd = new Schedule();
    this.cancel.emit(true);
  }

  addNewSchedule(valid: boolean): void {
    const endValid =
      !this.scheduleToAdd.end
      || +this.scheduleToAdd.end === 0
      || +this.scheduleToAdd.end >= +this.scheduleToAdd.start;

    this.formInvalid = !valid
      || !endValid
      || (this.scheduleToAdd.period && (+this.scheduleToAdd.period < 1))
      || (this.addProductMode && (!this.scheduleToAdd.product && !this.scheduleToAdd.product.id)
      || (!this.addProductMode && !this.productScheduleToAdd.id) );

    if (this.formInvalid) return;

    if (this.addProductMode) {
      this.addSchedule.next(this.scheduleToAdd);
    } else {
      this.scheduleToAdd.product.id = this.productId;
      this.productScheduleToAdd.schedules.push(this.scheduleToAdd);
      this.addProductSchedule.emit(this.productScheduleToAdd);
    }
    this.clearAddScheduleWithLoop();
  }

  addProductToSchedule(product: Product): void {
    this.scheduleToAdd.product = product;
  }

  addNewProductSchedule(productSchedule: ProductSchedule): void {
    this.productScheduleToAdd = productSchedule;
  }

  isTouched(): boolean {
    return false;
  }

}
