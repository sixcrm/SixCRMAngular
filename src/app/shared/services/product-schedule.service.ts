import {Injectable} from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {ProductSchedule} from '../models/product-schedule.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {
  productScheduleListQuery, productScheduleQuery,
  deleteProductScheduleMutation, createProductScheduleMutation, updateProductScheduleMutation
} from '../utils/queries/entities/product-schedule.queries';
import {HttpWrapperService} from './http-wrapper.service';

@Injectable()
export class ProductScheduleService extends AbstractEntityService<ProductSchedule> {

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
    super(
      http,
      authService,
      obj => new ProductSchedule(obj),
      productScheduleListQuery,
      productScheduleQuery,
      deleteProductScheduleMutation,
      createProductScheduleMutation,
      updateProductScheduleMutation,
      'productschedule'
    )
  }
}
