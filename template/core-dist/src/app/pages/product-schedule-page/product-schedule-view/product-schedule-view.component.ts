import { Component, OnInit } from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {ProductScheduleService} from '../../../shared/services/product-schedule.service';

@Component({
  selector: 'c-product-schedule-view',
  templateUrl: './product-schedule-view.component.html',
  styleUrls: ['./product-schedule-view.component.scss']
})
export class ProductScheduleViewComponent extends AbstractEntityViewComponent<ProductSchedule> implements OnInit {

  private productSchedule: ProductSchedule;

  constructor(
    private productScheduleService: ProductScheduleService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(productScheduleService, route, progressBarService);
  }

  ngOnInit() {
    this.productScheduleService.entity$.subscribe((schedule: ProductSchedule) => {
      this.productSchedule = schedule;
      this.progressBarService.hideTopProgressBar();
    });

    this.init();
  }

}
