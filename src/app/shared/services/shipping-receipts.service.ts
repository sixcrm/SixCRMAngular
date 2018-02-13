import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {HttpWrapperService} from './http-wrapper.service';
import {MdSnackBar} from '@angular/material';
import {ShippingReceipt} from '../models/shipping-receipt.model';
import {
  shippingReceiptsListQuery, shippingReceiptQuery,
  deleteShippingReceiptMutation, deleteShippingReceiptsMutation
} from '../utils/queries/entities/shipping-receipt.queries';

@Injectable()
export class ShippingReceiptsService extends AbstractEntityService<ShippingReceipt> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new ShippingReceipt(data),
      shippingReceiptsListQuery,
      shippingReceiptQuery,
      deleteShippingReceiptMutation,
      deleteShippingReceiptsMutation,
      null,
      null,
      'shippingreceipt',
      snackBar
    );
  }

}
