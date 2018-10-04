import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {CreditCard} from '../../shared/models/credit-card.model';
import {Subject} from 'rxjs';

@Component({
  selector: 'card-switcher-dialog',
  templateUrl: './card-switcher-dialog.component.html',
  styleUrls: ['./card-switcher-dialog.component.scss']
})
export class CardSwitcherDialogComponent implements OnInit {

  cards: CreditCard[];
  selectedDefaultCard: CreditCard = new CreditCard();
  updateEmbedded: boolean;
  addEmbedded: boolean;

  editCard: Subject<CreditCard> = new Subject();
  addCard: Subject<boolean> = new Subject();

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
