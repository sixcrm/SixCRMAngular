import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProductScheduleService} from '../../../shared/services/product-schedule.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {Schedule} from '../../../shared/models/schedule.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Product} from '../../../shared/models/product.model';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {AddScheduleComponent} from '../../../shared/components/add-schedule/add-schedule.component';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {AddProductScheduleDialogComponent} from '../../add-product-schedule-dialog.component';
import {MdDialog} from '@angular/material';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';

@Component({
  selector: 'product-schedule-view',
  templateUrl: './product-schedule-view.component.html',
  styleUrls: ['./product-schedule-view.component.scss']
})
export class ProductScheduleViewComponent extends AbstractEntityViewComponent<ProductSchedule> implements OnInit, OnDestroy {

  @ViewChild('endField') endField;
  @ViewChild('addScheduleComponent') addScheduleComponent: AddScheduleComponent;

  selectedIndex: number = 0;
  scheduleColumnParams = [
    new ColumnParams('PRODUCTSCHEDULE_CYCLE_NAME', (e: Schedule) => e.product.name),
    new ColumnParams('PRODUCTSCHEDULE_CYCLE_PRICE', (e: Schedule) => e.price.usd(), 'right').setNumberOption(true),
    new ColumnParams('PRODUCTSCHEDULE_CYCLE_START', (e: Schedule) => e.start + '', 'right').setNumberOption(true),
    new ColumnParams('PRODUCTSCHEDULE_CYCLE_END', (e: Schedule) => e.end === null ? '' : e.end + '', 'right').setNumberOption(true),
    new ColumnParams('PRODUCTSCHEDULE_CYCLE_PERIOD', (e: Schedule) => e.period + '', 'right').setNumberOption(true),
    new ColumnParams('PRODUCTSCHEDULE_CYCLE_SHIP', (e: Schedule) => e.product.ship + '')
  ];

  scheduleToAdd: Schedule = new Schedule();
  scheduleMapper = (s: Schedule) => s.product.name;

  price: string = '';

  tableTexts: TableMemoryTextOptions = {
    title: 'PRODUCTSCHEDULE_CYCLE_TITLE',
    editOptionText: 'PRODUCTSCHEDULE_CYCLE_EDIT',
    viewOptionText: 'PRODUCTSCHEDULE_CYCLE_VIEW',
    disassociateOptionText: 'PRODUCTSCHEDULE_CYCLE_REMOVE',
    noDataText: 'PRODUCTSCHEDULE_CYCLE_NODATA'
  };

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'PRODUCTSCHEDULE_TAB_GENERAL'},
    {name: 'campaigns', label: 'PRODUCTSCHEDULE_TAB_CAMPAIGN'}
  ];

  constructor(
    service: ProductScheduleService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public authService: AuthenticationService,
    private router: Router,
    private dialog: MdDialog
  ) {
    super(service, route);
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new ProductSchedule();
      this.entityBackup = new ProductSchedule();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }

  clearAddSchedule(): void {
    this.price = '';
    let loopProduct = this.scheduleToAdd ? this.scheduleToAdd.product : new Product();

    this.scheduleToAdd = new Schedule();
    this.scheduleToAdd.product = loopProduct.copy();
  }

  addScheduleToProduct(schedule: Schedule): void {
    this.entity.schedules.push(schedule);

    if (!this.addMode) {
      this.updateEntity(this.entity);
    } else {
      this.entity.schedules = this.entity.schedules.slice();
      this.clearAddSchedule();
    }
  }

  disassociateSchedule(schedule: Schedule) {
    let index = firstIndexOf(this.entity.schedules, (s: Schedule) => JSON.stringify(s) === JSON.stringify(schedule));

    if (index > -1) {
      this.entity.schedules.splice(index, 1);
      this.updateEntity(this.entity);
    }
  }

  navigateToProduct(schedule: Schedule) {
    this.router.navigate(['products', schedule.product.id])
  }

  canBeDeactivated() {
    return super.canBeDeactivated() && (!this.addScheduleComponent || !this.addScheduleComponent.isTouched());
  }

  editSchedule(schedule: Schedule) {
    let addProductScheduleDialog = this.dialog.open(AddProductScheduleDialogComponent);
    addProductScheduleDialog.componentInstance.price = schedule.price.amount + '';
    addProductScheduleDialog.componentInstance.scheduleToAdd = schedule;
    addProductScheduleDialog.componentInstance.addProductMode = true;
    addProductScheduleDialog.componentInstance.editMode = true;

    addProductScheduleDialog.afterClosed().take(1).subscribe(result => {
      addProductScheduleDialog = null;

      if (result) {
        this.service.updateEntity(this.entity);
      } else {
        this.entity = this.entityBackup.copy();
      }
    });
  }
}
