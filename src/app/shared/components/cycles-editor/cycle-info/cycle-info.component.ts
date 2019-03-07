import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Cycle} from '../../../models/product-schedule-cycles';

@Component({
  selector: 'cycle-info',
  templateUrl: './cycle-info.component.html',
  styleUrls: ['./cycle-info.component.scss']
})
export class CycleInfoComponent implements OnInit {

  @Input() selectedCycle: Cycle;
  @Input() set numberOfCycles(numberOfCycles: number) {
    this.cycleOptions = [];

    for (let i = 0; i < numberOfCycles; i++) {
      this.cycleOptions.push(i + 1);
    }

    this.cycleOptions.push('-');
  };

  @Output() nextCycleChanged: EventEmitter<{cycle: Cycle, nextCycle: number}> = new EventEmitter();
  @Output() granularityChanged: EventEmitter<'Days' | 'Month'> = new EventEmitter();
  @Output() deleteSelectedCycle: EventEmitter<Cycle> = new EventEmitter();

  cycleOptions: ('-' | number)[] = [];

  constructor() { }

  ngOnInit() {

  }

  nextChanged(nextCycle: '-' | number) {
    this.nextCycleChanged.emit({cycle: this.selectedCycle, nextCycle: nextCycle === '-' ? -1 : nextCycle})
  }

  deleteCycle() {
    this.deleteSelectedCycle.emit(this.selectedCycle);
  }
}
