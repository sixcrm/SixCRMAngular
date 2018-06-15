import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {AbstractPerfectMatch} from '../abstract-perfect-match.component';
import {ProductScheduleService} from '../../../../entity-services/services/product-schedule.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'perfect-product-schedule',
  templateUrl: './perfect-product-schedule.component.html',
  styleUrls: ['./perfect-product-schedule.component.scss']
})
export class PerfectProductScheduleComponent extends AbstractPerfectMatch implements OnInit, OnDestroy {

  productSchedule: ProductSchedule;

  constructor(private productSchedulesService: ProductScheduleService) {
    super();
  }

  ngOnInit() {
    this.productSchedulesService.entity$.takeUntil(this.unsubscribe$).subscribe(productSchedule => {
      if (productSchedule instanceof CustomServerError) {
        this.serverError = productSchedule;
        return;
      }

      this.serverError = null;
      this.productSchedule = productSchedule
    });

    this.productSchedulesService.getEntity(this.id);
  }

  ngOnDestroy() {
    this.destroy();
  }

}
