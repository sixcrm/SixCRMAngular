import { Component, OnInit } from '@angular/core';
import {ProductScheduleService} from '../../shared/services/product-schedule.service';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {ProductSchedule} from '../../shared/models/product-schedule.model';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';

@Component({
  selector: 'c-product-schedules',
  templateUrl: './product-schedules.component.html',
  styleUrls: ['./product-schedules.component.scss']
})
export class ProductSchedulesComponent extends AbstractEntityIndexComponent<ProductSchedule> implements OnInit {

  constructor(
    productScheduleService: ProductScheduleService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(productScheduleService, auth, dialog, progressBarService, paginationService);
  }

  ngOnInit() {
    this.init();
  }

}
