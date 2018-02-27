import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'spe-loader-body',
  templateUrl: './spe-loader-body.component.html',
  styleUrls: ['./spe-loader-body.component.scss']
})
export class SpeLoaderBodyComponent implements OnInit {

  @Input() numberOfTabs: number;
  @Input() numberOfCards: number;

  /*
   cardsExpression defines number and properties of cards
   Examples:
   m;m;m - 3 medium cards;
   m;s - 1 medium and 1 small card;
   30%;30%;30% - 3 cards, each will take 30% of space
   200px;30%;s - 3 cards, first will be 200px wide, second will take 30% of space and third will be small
   */
  @Input() cardsExpression: string;
  @Input() wrap: boolean = true;

  tabs: number[] = [];
  cards: string[] = [];

  constructor() { }

  ngOnInit() {

    if (this.numberOfTabs) {
      this.tabs = new Array(this.numberOfTabs);
    }

    if (this.cardsExpression) {
      this.cards = this.cardsExpression.split(';').map(c => {
        switch (c) {
          case 'l':
            return '500px';
          case 's':
            return '250px';
          case 'm':
            return '350px';
          default:
            return c;
        }
      })
    } else if (this.numberOfCards) {
      this.cards = new Array(this.numberOfCards).map(e => '350px');
    }
  }

}
