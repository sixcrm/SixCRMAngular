import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {ShippingReceipt} from '../../shared/models/shipping-receipt.model';
import {
  shippingReceiptsListQuery, shippingReceiptQuery,
  deleteShippingReceiptMutation, deleteShippingReceiptsMutation
} from '../../shared/utils/queries/entities/shipping-receipt.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class ShippingReceiptsService extends AbstractEntityService<ShippingReceipt> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
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
      null,
      'shippingreceipt',
      snackBar
    );
  }

}
