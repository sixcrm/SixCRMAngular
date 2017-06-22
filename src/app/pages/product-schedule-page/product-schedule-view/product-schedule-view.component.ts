import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProductScheduleService} from '../../../shared/services/product-schedule.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'product-schedule-view',
  templateUrl: './product-schedule-view.component.html',
  styleUrls: ['./product-schedule-view.component.scss']
})
export class ProductScheduleViewComponent extends AbstractEntityViewComponent<ProductSchedule> implements OnInit, OnDestroy {

  constructor(service: ProductScheduleService, route: ActivatedRoute, progressBar: ProgressBarService, public navigation: NavigationService) {
    super(service, route, progressBar);
  }

  ngOnInit() {
    super.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
