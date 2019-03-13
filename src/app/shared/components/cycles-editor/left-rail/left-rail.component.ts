import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {CycleProduct, Cycle} from '../../../models/product-schedule-cycles';

@Component({
  selector: 'left-rail',
  templateUrl: './left-rail.component.html',
  styleUrls: ['./left-rail.component.scss']
})
export class LeftRailComponent implements OnInit {

  @Output() addNewCycle: EventEmitter<boolean>  = new EventEmitter();

  @Input() title: string;
  @Input() selectedCycle: Cycle;
  @Input() products: CycleProduct[] = [];

  constructor() { }

  ngOnInit() {
  }

}
