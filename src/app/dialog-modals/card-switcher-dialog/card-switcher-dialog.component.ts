import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {CreditCard} from '../../shared/models/credit-card.model';

@Component({
  selector: 'card-switcher-dialog',
  templateUrl: './card-switcher-dialog.component.html',
  styleUrls: ['./card-switcher-dialog.component.scss']
})
export class CardSwitcherDialogComponent implements OnInit {

  cards: CreditCard[];
  selectedDefaultCard: CreditCard = new CreditCard();

  constructor(private dialogRef: MatDialogRef<CardSwitcherDialogComponent>) { }

  ngOnInit() {
  }

  submit(): void {
    this.dialogRef.close({selectedDefaultCard: this.selectedDefaultCard})
  }

  close(): void {
    this.dialogRef.close({});
  }

  changeDefaultCard(event) {
    this.selectedDefaultCard = event.value.copy();
  }

}
