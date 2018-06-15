import { Component, OnInit } from '@angular/core';
import {Products} from '../../shared/models/products.model';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'return-dialog',
  templateUrl: './return-dialog.component.html',
  styleUrls: ['./return-dialog.component.scss']
})
export class ReturnDialogComponent implements OnInit {

  products: ReturnableProduct[] = [];

  constructor(private dialogRef: MatDialogRef<ReturnDialogComponent>) { }

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

}

interface ReturnableProduct extends Products {
  selected?: boolean;
}
