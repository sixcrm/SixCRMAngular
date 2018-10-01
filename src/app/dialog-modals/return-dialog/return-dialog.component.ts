import { Component, OnInit } from '@angular/core';
import {Products} from '../../shared/models/products.model';
import {MatDialogRef} from '@angular/material';
import {ReturnsService} from '../../entity-services/services/returns.service';
import {Return} from '../../shared/models/return.model';
import {ReturnTransactionProductItem} from '../../shared/models/return-transaction-item.model';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';

@Component({
  selector: 'return-dialog',
  templateUrl: './return-dialog.component.html',
  styleUrls: ['./return-dialog.component.scss']
})
export class ReturnDialogComponent implements OnInit {

  products: ReturnableProduct[] = [];
  transaction: string;

  constructor(private dialogRef: MatDialogRef<ReturnDialogComponent>, private returnsService: ReturnsService) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close({});
  }

  globalCheckboxClicked(event) {
    for (let p of this.products) {
      p.selected = event.checked;
    }
  }

  processReturn() {
    const allSelected = this.products.filter(p => p.selected);

    if (!allSelected || allSelected.length === 0) {
      this.close();
      return;
    }

    const transProducts = allSelected.map(p => new ReturnTransactionProductItem({product: p.product.id, quantity: p.quantity}));
    const ret = new Return({transactions: [{transaction: this.transaction, products: transProducts}]});

    this.returnsService.entityCreated$.take(1).subscribe(createdReturn => {
      if (createdReturn instanceof CustomServerError) return;

      this.dialogRef.close({'return': createdReturn});
    });

    this.returnsService.createEntity(ret);
  }

}

interface ReturnableProduct extends Products {
  selected?: boolean;
}
