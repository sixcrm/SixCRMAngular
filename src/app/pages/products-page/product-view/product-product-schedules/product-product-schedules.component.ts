import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {ProductScheduleService} from '../../../../shared/services/product-schedule.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {MdDialog, MdDialogRef} from '@angular/material';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {
  productSchedulesByProduct,
  productScheduleListQuery
} from '../../../../shared/utils/queries/entities/product-schedule.queries';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {AddProductScheduleDialogComponent} from '../../../add-product-schedule-dialog.component';

@Component({
  selector: 'product-product-schedules',
  templateUrl: './product-product-schedules.component.html',
  styleUrls: ['./product-product-schedules.component.scss']
})
export class ProductProductSchedulesComponent extends AbstractEntityIndexComponent<ProductSchedule> implements OnInit, OnDestroy {

  @Input() id: string;
  @Input() price: string = '0';

  private addProductScheduleDialog: MdDialogRef<AddProductScheduleDialogComponent>;

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

  removeProductSchedule(productSchedule: ProductSchedule) {
    productSchedule.schedules = productSchedule.schedules.filter(s => s.product.id !== this.id);

    this.service.entityUpdated$.take(1).takeUntil(this.unsubscribe$).subscribe(entity => {
      if (entity instanceof CustomServerError) return;

      this.entities = this.entities.filter(entity => entity.id !== productSchedule.id);
    });

    this.service.updateEntity(productSchedule);
  }

  showAddProductScheduleModal() {
    this.service.indexQuery = productScheduleListQuery;
    this.addProductScheduleDialog = this.deleteDialog.open(AddProductScheduleDialogComponent);
    this.addProductScheduleDialog.componentInstance.price = this.price;
    this.addProductScheduleDialog.componentInstance.productId = this.id;

    this.addProductScheduleDialog.afterClosed().take(1).subscribe(result => {
      this.service.indexQuery = (limit?:number, cursor?:string) => productSchedulesByProduct(this.id, limit, cursor);
      this.addProductScheduleDialog = null;

      this.service.entityCreated$.take(1).takeUntil(this.unsubscribe$).subscribe(ps => {
        if (ps instanceof CustomServerError) return;

        this.entities.push(ps)
      });
      if (result && result.id) {
        this.service.createEntity(result)
      }
    });
  }
}
