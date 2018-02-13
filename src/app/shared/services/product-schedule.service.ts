import {Injectable} from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {ProductSchedule} from '../models/product-schedule.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {
  productScheduleListQuery, productScheduleQuery,
  deleteProductScheduleMutation, createProductScheduleMutation, updateProductScheduleMutation,
  deleteProductSchedulesMutation
} from '../utils/queries/entities/product-schedule.queries';
import {HttpWrapperService} from './http-wrapper.service';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class ProductScheduleService extends AbstractEntityService<ProductSchedule> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
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
      'productschedule',
      snackBar
    )
  }
}
