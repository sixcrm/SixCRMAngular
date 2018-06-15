import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProductScheduleService} from '../../../entity-services/services/product-schedule.service';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'c-product-schedules',
  templateUrl: './product-schedules.component.html',
  styleUrls: ['./product-schedules.component.scss']
})
export class ProductSchedulesComponent extends AbstractEntityIndexComponent<ProductSchedule> implements OnInit, OnDestroy {

  constructor(
    productScheduleService: ProductScheduleService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(productScheduleService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new ProductSchedule();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('PRODUCTSCHEDULE_INDEX_HEADER_ID', (e: ProductSchedule) => e.id).setSelected(false),
      new ColumnParams('PRODUCTSCHEDULE_INDEX_HEADER_NAME', (e: ProductSchedule) => e.name),
      new ColumnParams('PRODUCTSCHEDULE_INDEX_HEADER_NUMOFCYCLES', (e: ProductSchedule) => e.schedules.length.toString(), 'right').setNumberOption(true),
      new ColumnParams('PRODUCTSCHEDULE_INDEX_HEADER_CREATED', (e: ProductSchedule) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(true),
      new ColumnParams('PRODUCTSCHEDULE_INDEX_HEADER_UPDATED', (e: ProductSchedule) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(true)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
