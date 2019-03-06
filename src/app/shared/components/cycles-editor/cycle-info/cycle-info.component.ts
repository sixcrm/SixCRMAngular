import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Cycle} from '../../../models/product-schedule-cycles';

@Component({
  selector: 'cycle-info',
  templateUrl: './cycle-info.component.html',
  styleUrls: ['./cycle-info.component.scss']
})
export class CycleInfoComponent implements OnInit {

  @Input() selectedCycle: Cycle;
  @Input() numberOfCycles: number;

  @Output() nextCycleChanged: EventEmitter<{cycle: Cycle, nextCycle: '-' | number}> = new EventEmitter();
  @Output() granularityChanged: EventEmitter<'Days' | 'Month'> = new EventEmitter();

  cycleOptions: ('-' | number)[] = [];

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < this.numberOfCycles; i++) {
      this.cycleOptions.push(i + 1);
    }

    this.cycleOptions.push('-');
  }

  nextChanged(nextCycle: '-' | number) {
    this.nextCycleChanged.emit({cycle: this.selectedCycle, nextCycle})
  }

}
