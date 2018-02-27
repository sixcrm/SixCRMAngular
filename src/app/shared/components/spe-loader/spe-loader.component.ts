import {Component, OnInit, Input} from '@angular/core';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'spe-loader',
  templateUrl: './spe-loader.component.html',
  styleUrls: ['./spe-loader.component.scss']
})
export class SpeLoaderComponent implements OnInit {

  @Input() numberOfTabs: number;
  @Input() numberOfCards: number;
  @Input() showBreadcrumb: boolean = true;
  @Input() blue: boolean;

  /*
    cardsExpression defines number and properties of cards
    Examples:
      m;m;m - 3 medium cards;
      m;s - 1 medium and 1 small card;
      30%;30%;30% - 3 cards, each will take 30% of space
      200px;30%;s - 3 cards, first will be 200px wide, second will take 30% of space and third will be small
   */
  @Input() cardsExpression: string;
  @Input() title: string;
  @Input() wrap: boolean = true;

  constructor(public navigation: NavigationService) { }

  ngOnInit() {}

}
