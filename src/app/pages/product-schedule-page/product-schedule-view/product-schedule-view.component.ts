import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProductScheduleService} from '../../../shared/services/product-schedule.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {Schedule} from '../../../shared/models/schedule.model';
import {ColumnParams, ColumnParamsInputType} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Product} from '../../../shared/models/product.model';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {AddScheduleComponent} from '../../../shared/components/add-schedule/add-schedule.component';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {ProductsService} from '../../../shared/services/products.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {BreadcrumbItem} from '../../components/entity-view-breadcrumbs/entity-view-breadcrumbs.component';
import {utc, Moment} from 'moment'
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from '../../delete-dialog.component';

@Component({
  selector: 'product-schedule-view',
  templateUrl: './product-schedule-view.component.html',
  styleUrls: ['./product-schedule-view.component.scss']
})
export class ProductScheduleViewComponent extends AbstractEntityViewComponent<ProductSchedule> implements OnInit, OnDestroy {

  @ViewChild('endField') endField;
  @ViewChild('addScheduleComponent') addScheduleComponent: AddScheduleComponent;

  startDate: Moment = utc().millisecond(0).second(0).minute(0).hour(0);

  selectedIndex: number = 0;
  scheduleColumnParams = [
    new ColumnParams('PRODUCTSCHEDULE_CYCLE_IMAGE')
      .setMappingFunction((e: Schedule) => e.product.getDefaultImagePath() || '/assets/images/product-image-placeholder.svg')
      .setShowLabel(false)
      .setSortEnabled(false)
      .setInputType(ColumnParamsInputType.IMAGE),
    new ColumnParams('PRODUCTSCHEDULE_CYCLE_NAME')
      .setMappingFunction((e: Schedule) => e.product.name)
      .setAssigningFunction((e: Schedule, value: Product) => {
        e.product = value;
        e.price = value.defaultPrice;

        return e;
      })
      .setValidator((e: Schedule) => !!(e.product && e.product.id))
      .setInputType(ColumnParamsInputType.AUTOCOMPLETE)
      .setAutocompleteOptions([])
      .setAutocompleteMapper((product) => product.name)
      .setAutocompleteInitialValue((schedule) => schedule.product)
      .setAutofocus(true),
    new ColumnParams('PRODUCTSCHEDULE_CYCLE_PRICE')
      .setMappingFunction((e: Schedule) => e.price)
      .setAssigningFunction((e: Schedule, value) => e.price = value)
      .setAlign('right')
      .setInputType(ColumnParamsInputType.CURRENCY)
      .setNumberOption(true),
    new ColumnParams('PRODUCTSCHEDULE_CYCLE_START')
      .setMappingFunction((e: Schedule) => e.start)
      .setAssigningFunction((e: Schedule, value) => e.start = (!value || isNaN(value)) ? 0 : parseInt(value))
      .setAlign('right')
      .setInputType(ColumnParamsInputType.NUMERIC)
      .setNumberOption(true),
    new ColumnParams('PRODUCTSCHEDULE_CYCLE_END')
      .setMappingFunction((e: Schedule) => e.end === null ? '' : e.end + '')
      .setAssigningFunction((e: Schedule, value) => e.end = (!value || isNaN(value)) ? 0 : parseInt(value))
      .setInputType(ColumnParamsInputType.NUMERIC)
      .setValidator((e: Schedule) => e.end >= e.start)
      .setAlign('right')
      .setNumberOption(true),
    new ColumnParams('PRODUCTSCHEDULE_CYCLE_PERIOD')
      .setMappingFunction((e: Schedule) => e.period)
      .setAssigningFunction((e: Schedule, value) => e.period = (!value || isNaN(value)) ? 0 : parseInt(value))
      .setInputType(ColumnParamsInputType.NUMERIC)
      .setValidator((e: Schedule) => (e.end < e.start) || (e.period <= e.end - e.start))
      .setAlign('right')
      .setNumberOption(true),
    new ColumnParams('PRODUCTSCHEDULE_CYCLE_SHIP')
      .setMappingFunction((e: Schedule) => e.product.ship)
      .setInputType(ColumnParamsInputType.BOOLEAN)
      .setAlign('center')
      .setEditable(false)
  ];

  scheduleFactory = (data: any) => {
    const schedule: Schedule = new Schedule(data);

    if (!this.entity.schedules || this.entity.schedules.length === 0) return schedule;

    const lastExistingSchedule: Schedule = this.entity.schedules[this.entity.schedules.length - 1];

    schedule.start = lastExistingSchedule.end;
    schedule.end = schedule.start + schedule.period;
    schedule.period = lastExistingSchedule.period;

    return schedule;
  };

  tableTexts: TableMemoryTextOptions = {
    title: 'PRODUCTSCHEDULE_CYCLE_TITLE',
    editOptionText: 'PRODUCTSCHEDULE_CYCLE_EDIT',
    viewOptionText: 'PRODUCTSCHEDULE_CYCLE_VIEW',
    disassociateOptionText: 'PRODUCTSCHEDULE_CYCLE_REMOVE',
    associateOptionText: 'PRODUCTSCHEDULE_CYCLE_ADD',
    noDataText: 'PRODUCTSCHEDULE_CYCLE_NODATA'
  };

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'PRODUCTSCHEDULE_TAB_GENERAL'},
    {name: 'cycles', label: 'PRODUCTSCHEDULE_TAB_CYCLE'},
    {name: 'list', label: 'PRODUCTSCHEDULE_TAB_LIST'},
    {name: 'campaigns', label: 'PRODUCTSCHEDULE_TAB_CAMPAIGN'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'PRODUCTSCHEDULE_INDEX_TITLE', url: '/productschedules'},
    {label: () => this.entity.name}
  ];

  detailsElement: ElementRef;
  saveDebouncer: Subject<ProductSchedule> = new Subject();
  productScheduleWaitingForUpdate: ProductSchedule;
  updateError: boolean;
  autosaveDebouncer: number = 3500;

  constructor(
    service: ProductScheduleService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public authService: AuthenticationService,
    private router: Router,
    private productService: ProductsService,
    private dialog: MatDialog
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.takeUpdated = false;

    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe(ps => {
      if (ps instanceof CustomServerError) {
        this.updateError = true;
      } else {
        this.updateError = false;
        this.entity.updatedAtAPI = ps.updatedAtAPI;
        this.entity.updatedAt = ps.updatedAt.clone();
        this.entityBackup = this.entity.copy();
        this.productScheduleWaitingForUpdate = null;
      }
    });

    this.saveDebouncer.debounceTime(this.autosaveDebouncer).takeUntil(this.unsubscribe$).subscribe(productSchedule => {
      productSchedule.updatedAtAPI = this.entity.updatedAtAPI;
      productSchedule.updatedAt = this.entity.updatedAt.clone();
      this.updateEntity(productSchedule, {ignoreSnack: true});
    });

    super.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new ProductSchedule();
      this.entityBackup = new ProductSchedule();
    } else {
      this.productService.entities$.takeUntil(this.unsubscribe$).subscribe(products => {
        if (products instanceof CustomServerError) return;

        this.scheduleColumnParams[1].setAutocompleteOptions(products);
      });
      this.productService.getEntities();
    }
  }

  ngOnDestroy() {
    this.destroy();

    if (this.productScheduleWaitingForUpdate) {
      this.productScheduleWaitingForUpdate.updatedAtAPI = this.entity.updatedAtAPI;
      this.productScheduleWaitingForUpdate.updatedAt = this.entity.updatedAt.clone();
      this.updateEntity(this.productScheduleWaitingForUpdate);
    }
  }

  setIndex(value: number): void {
    this.selectedIndex = value;

    if (this.selectedIndex === 1) {
      this.navigation.setSidenavAuto(false);
    } else {
      this.navigation.resetSidenavAuto();
    }
  }

  addSchedule(schedule: Schedule) {
    this.entity.schedules.push(schedule);

    this.updateEntity(this.entity);
  }

  updateSchedule(schedule: Schedule): void {
    for (let i = 0; i < this.entity.schedules.length; i++) {
      if (this.entity.schedules[i]['tableAdvancedIdentifier'] === schedule['tableAdvancedIdentifier']) {
        this.entity.schedules[i] = schedule;
        break;
      }
    }

    this.updateEntity(this.entity);
  }

  disassociateSchedule(schedule: Schedule) {
    this.openDeleteDialog(() => {
      const index = firstIndexOf(this.entity.schedules, (s: Schedule) => JSON.stringify(s) === JSON.stringify(schedule));

      if (index > -1) {
        this.entity.schedules.splice(index, 1);
        this.updateEntity(this.entity);
      }
    });
  }

  disassociateSchedules(schedules: Schedule[]) {

    this.openDeleteDialog(() => {
      schedules.forEach(schedule => {
        const index = firstIndexOf(this.entity.schedules, (s: Schedule) => JSON.stringify(s) === JSON.stringify(schedule));

        if (index > -1) {
          this.entity.schedules.splice(index, 1);
        }
      });

      this.updateEntity(this.entity);
    })
  }

  navigateToProduct(schedule: Schedule) {
    this.router.navigate(['products', schedule.product.id])
  }

  canBeDeactivated() {
    return super.canBeDeactivated() && (!this.addScheduleComponent || !this.addScheduleComponent.isTouched());
  }

  openDeleteDialog(callback: () => void) {
    let deleteDialog = this.dialog.open(DeleteDialogComponent);

    deleteDialog.afterClosed().takeUntil(this.unsubscribe$).subscribe(result => {
      deleteDialog = null;
      if (result && result.success) {
        callback();
      }
    });
  }

  setDetails(details) {
    this.detailsElement = details;
  }

  productSchedulesChanged(productSchedules: ProductSchedule[]) {
    if (productSchedules && productSchedules.length > 0) {
      this.productScheduleWaitingForUpdate = productSchedules[0];
      this.saveDebouncer.next(productSchedules[0]);
    }
  }
}
