import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProductScheduleService} from '../../shared/services/product-schedule.service';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {ProductSchedule} from '../../shared/models/product-schedule.model';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../shared/models/column-params.model';

@Component({
  selector: 'c-product-schedules',
  templateUrl: './product-schedules.component.html',
  styleUrls: ['./product-schedules.component.scss']
})
export class ProductSchedulesComponent extends AbstractEntityIndexComponent<ProductSchedule> implements OnInit, OnDestroy {

  constructor(
    productScheduleService: ProductScheduleService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(productScheduleService, auth, dialog, progressBarService, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('ID', (e: ProductSchedule) => e.id),
      new ColumnParams('Number Of Product Schedules', (e: ProductSchedule) => e.schedules.length.toString(), 'right')
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
