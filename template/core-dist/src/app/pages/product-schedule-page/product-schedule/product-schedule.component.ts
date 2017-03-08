import { Component, OnInit } from '@angular/core';
import {AbstractEntityComponent} from '../../abstract-entity-component';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {ProductScheduleService} from '../../../shared/services/product-schedule.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'product-schedule',
  templateUrl: './product-schedule.component.html',
  styleUrls: ['./product-schedule.component.scss']
})
export class ProductScheduleComponent extends AbstractEntityComponent<ProductSchedule> implements OnInit {

  constructor(service: ProductScheduleService, progressBarService: ProgressBarService) {
    super(service, progressBarService);
  }

  ngOnInit() {
    this.init();
  }

}
