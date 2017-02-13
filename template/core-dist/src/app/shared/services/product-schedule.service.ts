import {Injectable} from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {ProductSchedule} from '../models/product-schedule.model';
import {
  productScheduleListQuery, productScheduleQuery, deleteProductScheduleMutation,
  createProductScheduleMutation, updateProductScheduleMutation
} from '../utils/query-builder';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';

@Injectable()
export class ProductScheduleService extends AbstractEntityService<ProductSchedule> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      obj => new ProductSchedule(obj),
      productScheduleListQuery,
      productScheduleQuery,
      deleteProductScheduleMutation,
      createProductScheduleMutation,
      updateProductScheduleMutation
    )
  }
}
