import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {ProductScheduleService} from '../../../../shared/services/product-schedule.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {
  productSchedulesByProduct,
  productScheduleListQuery
} from '../../../../shared/utils/queries/entities/product-schedule.queries';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {AddProductScheduleDialogComponent} from '../../../add-product-schedule-dialog.component';
import {Currency} from '../../../../shared/utils/currency/currency';
import {Schedule} from '../../../../shared/models/schedule.model';
import {IndexQueryParameters} from '../../../../shared/utils/queries/index-query-parameters.model';
import {MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'product-product-schedules',
  templateUrl: './product-product-schedules.component.html',
  styleUrls: ['./product-product-schedules.component.scss']
})
export class ProductProductSchedulesComponent extends AbstractEntityIndexComponent<ProductSchedule> implements OnInit, OnDestroy {

  @Input() id: string;
  @Input() defaultPrice: Currency = new Currency(0);

  private addProductScheduleDialog: MatDialogRef<AddProductScheduleDialogComponent>;

  constructor(
    productScheduleService: ProductScheduleService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(productScheduleService, auth, dialog, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('PRODUCT_SCHEDULES_NAME', (e: ProductSchedule) => e.name),
      new ColumnParams('PRODUCT_SCHEDULES_COUNT', (e: ProductSchedule) => e.schedules.length.toString(), 'right').setNumberOption(true)
    ];
  }

  ngOnInit() {
    this.service.indexQuery = (params: IndexQueryParameters) => productSchedulesByProduct(this.id, params);
    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = productScheduleListQuery;
    this.destroy();
  }

  removeProductSchedule(productSchedule: ProductSchedule) {
    productSchedule.schedules = productSchedule.schedules.filter(s => s.product.id !== this.id);

    this.service.entityUpdated$.take(1).takeUntil(this.unsubscribe$).subscribe(entity => {
      if (entity instanceof CustomServerError) return;

      this.entitiesHolder = this.entitiesHolder.filter(entity => entity.id !== productSchedule.id);
      this.allEntities.emit(this.entitiesHolder);
      this.reshuffleEntities();
    });

    this.service.updateEntity(productSchedule);
  }

  showAddProductScheduleModal() {
    this.service.indexQuery = productScheduleListQuery;
    this.addProductScheduleDialog = this.deleteDialog.open(AddProductScheduleDialogComponent);
    this.addProductScheduleDialog.componentInstance.scheduleToAdd = new Schedule({price: this.defaultPrice.amount});
    this.addProductScheduleDialog.componentInstance.productId = this.id;

    this.addProductScheduleDialog.afterClosed().take(1).subscribe(result => {
      this.service.indexQuery = (params: IndexQueryParameters) => productSchedulesByProduct(this.id, params);
      this.addProductScheduleDialog = null;

      if (result && result.id) {
        this.service.entityUpdated$.take(1).takeUntil(this.unsubscribe$).subscribe(entity => {
          if (entity instanceof CustomServerError) return;

          this.entitiesHolder.unshift(entity);
          this.allEntities.emit(this.entitiesHolder);
          this.reshuffleEntities();
        });

        this.service.updateEntity(result)
      }
    });
  }
}
