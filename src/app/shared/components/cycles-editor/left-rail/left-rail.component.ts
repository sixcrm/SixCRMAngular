import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Cycle, CycleProduct} from '../../../models/product-schedule.model';

@Component({
  selector: 'left-rail',
  templateUrl: './left-rail.component.html',
  styleUrls: ['./left-rail.component.scss']
})
export class LeftRailComponent implements OnInit {

  @Output() addNewCycle: EventEmitter<boolean>  = new EventEmitter();

  @Input() title: string;
  @Input() selectedCycle: Cycle;
  @Input() cycleProducts: CycleProduct[] = [];

  constructor() { }

  ngOnInit() {
  }

}
