import { Component, OnInit } from '@angular/core';
import {ProductScheduleService} from '../../shared/services/product-schedule.service';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {ProductSchedule} from '../../shared/models/product-schedule.model';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';

@Component({
  selector: 'c-product-schedule',
  templateUrl: './product-schedule.component.html',
  styleUrls: ['./product-schedule.component.scss']
})
export class ProductScheduleComponent extends AbstractEntityIndexComponent<ProductSchedule> implements OnInit {

  constructor(
    private productScheduleService: ProductScheduleService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(productScheduleService, auth, dialog, progressBarService, paginationService);
  }

  ngOnInit() {
    this.productScheduleService.entityDeleted$.subscribe((data) => this.productScheduleService.getEntities());

    this.init();
  }

}
