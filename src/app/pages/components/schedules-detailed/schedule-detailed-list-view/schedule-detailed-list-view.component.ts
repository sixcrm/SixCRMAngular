import {Component, OnInit, Input} from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule-legacy.model';
import {Schedule} from '../../../../shared/models/schedule.model';
import {ColumnParamsInputType, ColumnParams} from '../../../../shared/models/column-params.model';
import {TableMemoryTextOptions} from '../../table-memory/table-memory.component';
import {Product} from '../../../../shared/models/product.model';

@Component({
  selector: 'schedule-detailed-list-view',
  templateUrl: './schedule-detailed-list-view.component.html',
  styleUrls: ['./schedule-detailed-list-view.component.scss']
})
export class ScheduleDetailedListViewComponent implements OnInit {

  @Input() productSchedules: ProductSchedule[] = [];
  @Input() set products(value: Product[]) {
    this.scheduleColumnParams[1].setAutocompleteOptions(value);
  }

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

  scheduleFactory = (productSchedule: ProductSchedule) => {
    return (data: any) => {
      if (productSchedule.schedules && productSchedule.schedules.length !== 0) {
        const lastExistingSchedule: Schedule = productSchedule.schedules[productSchedule.schedules.length - 1];

        data.start = +lastExistingSchedule.end || 0;
        data.period = +lastExistingSchedule.period || 0;
        data.end = data.start + data.period;
      }

      return new Schedule(data)
    };
  };

  constructor() { }

  ngOnInit() {
  }

  getTableText(productSchedule: ProductSchedule): TableMemoryTextOptions {
    return {
      title: productSchedule.name,
      editOptionText: 'PRODUCTSCHEDULE_CYCLE_EDIT',
      viewOptionText: 'PRODUCTSCHEDULE_CYCLE_VIEW',
      disassociateOptionText: 'PRODUCTSCHEDULE_CYCLE_REMOVE',
      associateOptionText: 'PRODUCTSCHEDULE_CYCLE_ADD',
      noDataText: 'PRODUCTSCHEDULE_CYCLE_NODATA'
    };
  }
}
