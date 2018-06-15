import {Injectable} from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {ProductSchedule} from '../../shared/models/product-schedule.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {
  productScheduleListQuery, productScheduleQuery,
  deleteProductScheduleMutation, createProductScheduleMutation, updateProductScheduleMutation,
  deleteProductSchedulesMutation
} from '../../shared/utils/queries/entities/product-schedule.queries';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class ProductScheduleService extends AbstractEntityService<ProductSchedule> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      obj => new ProductSchedule(obj),
      productScheduleListQuery,
      productScheduleQuery,
      deleteProductScheduleMutation,
      deleteProductSchedulesMutation,
      createProductScheduleMutation,
      updateProductScheduleMutation,
      null,
      'productschedule',
      snackBar
    )
  }
}
