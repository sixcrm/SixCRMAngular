import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'spe-loader',
  templateUrl: './spe-loader.component.html',
  styleUrls: ['./spe-loader.component.scss']
})
export class SpeLoaderComponent implements OnInit {

  @Input() numberOfTabs: number;
  @Input() numberOfCards: number;
  @Input() title: string;

  tabs: number[] = [];
  cards: number[] = [];

  constructor() { }

  ngOnInit() {

    if (this.tabs) {
      this.tabs = new Array(this.numberOfTabs);
    }

    if (this.cards) {
      this.cards = new Array(this.numberOfCards);
    }
  }

}
