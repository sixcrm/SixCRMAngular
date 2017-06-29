import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {ProductScheduleService} from '../../../../shared/services/product-schedule.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {
  productSchedulesByProduct,
  productScheduleListQuery
} from '../../../../shared/utils/queries/entities/product-schedule.queries';

@Component({
  selector: 'product-product-schedules',
  templateUrl: './product-product-schedules.component.html',
  styleUrls: ['./product-product-schedules.component.scss']
})
export class ProductProductSchedulesComponent extends AbstractEntityIndexComponent<ProductSchedule> implements OnInit, OnDestroy {

  @Input() id: string;

  constructor(
    productScheduleService: ProductScheduleService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(productScheduleService, auth, dialog, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('Name', (e: ProductSchedule) => e.name),
      new ColumnParams('Number Of Product Schedules', (e: ProductSchedule) => e.schedules.length.toString(), 'right')
    ];
  }

  ngOnInit() {
    this.service.indexQuery = (limit?:number, cursor?:string) => productSchedulesByProduct(this.id, limit, cursor);
    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = productScheduleListQuery;
    this.destroy();
  }

}
