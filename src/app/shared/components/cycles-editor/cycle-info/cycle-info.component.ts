import {Component, OnInit, Input} from '@angular/core';
import {Cycle} from '../../../models/product-schedule-cycles';

@Component({
  selector: 'cycle-info',
  templateUrl: './cycle-info.component.html',
  styleUrls: ['./cycle-info.component.scss']
})
export class CycleInfoComponent implements OnInit {

  @Input() selectedCycle: Cycle;

  constructor() { }

  ngOnInit() {
  }

}
