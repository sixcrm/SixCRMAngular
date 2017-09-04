import {Component, OnInit, ViewChild, Output, Input, EventEmitter} from '@angular/core';
import {Schedule} from '../../models/schedule.model';
import {Product} from '../../models/product.model';
import {ProductsService} from '../../services/products.service';
import {parseCurrencyMaskedValue, getCurrencyMask} from '../../utils/mask.utils';
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
  numberMask = getCurrencyMask();

  scheduleToAdd: Schedule = new Schedule();
  productScheduleToAdd: ProductSchedule = new ProductSchedule();
  productMapper = (p: Product) => p.name;

  formInvalid: boolean;

  @Input() price: string = '';
  @Input() addProductMode: boolean = true;
  @Input() productId: string;

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
    this.price = '';
    let loopProduct = this.scheduleToAdd ? this.scheduleToAdd.product : new Product();

    this.scheduleToAdd = new Schedule();
    this.scheduleToAdd.product = loopProduct.copy();

    this.cancel.emit(true);
  }

  clearAddSchedule(): void {
    this.price = '';
    this.scheduleToAdd = new Schedule();
    this.cancel.emit(true);
  }

  addNewSchedule(valid: boolean): void {
    console.log(valid, this.productScheduleToAdd);
    this.formInvalid = !valid
      || (this.addProductMode && (!this.scheduleToAdd.product && !this.scheduleToAdd.product.id)
      || (!this.addProductMode && !this.productScheduleToAdd.id) );
    if (this.formInvalid) return;

    if (this.scheduleToAdd.end && this.scheduleToAdd.end < this.scheduleToAdd.start) {
      this.endField.nativeElement.focus();
      return;
    }

    this.scheduleToAdd.price.amount = parseCurrencyMaskedValue(this.price);

    if (this.addProductMode) {
      this.addSchedule.next(this.scheduleToAdd);
    } else {
      this.scheduleToAdd.product.id = this.productId;
      this.productScheduleToAdd.schedules.push(this.scheduleToAdd);
      this.addProductSchedule.emit(this.productScheduleToAdd);
    }
    this.clearAddScheduleWithLoop();
  }

  endChanged() {
    if (!this.scheduleToAdd.end) {
      this.scheduleToAdd.period = 0;
      return;
    }

    if (+this.scheduleToAdd.end > +(this.scheduleToAdd.start || 0)) {
      this.scheduleToAdd.start = this.scheduleToAdd.start || 0;
      this.scheduleToAdd.period = +this.scheduleToAdd.end - +this.scheduleToAdd.start;
    }
  }

  startChanged() {
    if (!this.scheduleToAdd.start) {
      return;
    }

    if (+this.scheduleToAdd.start < +(this.scheduleToAdd.end || 0)) {
      this.scheduleToAdd.period = this.scheduleToAdd.end - this.scheduleToAdd.start;
    }
  }

  periodChanged() {
    if (!this.scheduleToAdd.period) {
      return;
    }

    this.scheduleToAdd.start = this.scheduleToAdd.start || 0;
    this.scheduleToAdd.end = +this.scheduleToAdd.start + +this.scheduleToAdd.period;
  }

  addProductToSchedule(product: Product): void {
    this.scheduleToAdd.product = product;
    this.price = product.defaultPrice.amount + '';
  }

  addNewProductSchedule(productSchedule: ProductSchedule): void {
    this.productScheduleToAdd = productSchedule;
  }

}
