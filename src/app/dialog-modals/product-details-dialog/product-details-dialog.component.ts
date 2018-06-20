import { Component, OnInit } from '@angular/core';
import {Product} from '../../shared/models/product.model';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'product-details-dialog',
  templateUrl: './product-details-dialog.component.html',
  styleUrls: ['./product-details-dialog.component.scss']
})
export class ProductDetailsDialogComponent implements OnInit {

  product: Product;

  constructor(private dialogRef: MatDialogRef<ProductDetailsDialogComponent>) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
