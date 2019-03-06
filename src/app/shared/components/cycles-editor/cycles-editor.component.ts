import {Component, OnInit, Input} from '@angular/core';
import {ProductScheduleCycles, Cycle, CycleProduct} from '../../models/product-schedule-cycles';
import {firstIndexOf} from '../../utils/array.utils';

@Component({
  selector: 'cycles-editor',
  templateUrl: './cycles-editor.component.html',
  styleUrls: ['./cycles-editor.component.scss']
})
export class CyclesEditorComponent implements OnInit {

  @Input()
  public productSchedule: ProductScheduleCycles;

  public zoomLevel: number = 5;

  public selectedCycle: Cycle;
  public products: CycleProduct[];

  constructor() { }

  ngOnInit() {
    this.products = this.productSchedule.cycles
      .map(cycle => cycle.cycleProducts)
      .reduce((a,b) => a.concat(...b), [])
      .reduce((a,b) => firstIndexOf(a, el => el.id === b.id) === -1 ? a.concat(b) : a, []);
  }

  addNewCycle() {

  }

  cycleSelected(selectedCycle: Cycle): void {
    this.selectedCycle = selectedCycle;
  }

  getTitle() {
    const lastCycle = this.productSchedule.cycles[this.productSchedule.cycles.length - 1];

    if (+lastCycle.nextPosition <= +lastCycle.position) {
      return `∞ Days in Subscription`;
    }

    return `${this.productSchedule.cycles.map(cycle => cycle.length).reduce((a,b) => a+b,0)} Days in Subscription`;
  }

  nextCycleChanged(data: {cycle: Cycle, nextCycle: '-' | number}) {
    data.cycle.nextPosition = data.nextCycle + '';
  }

  granularityChanged(granularity: 'Days' | 'Month') {
    if (granularity === 'Days') {
      this.selectedCycle.monthly = false;
      this.selectedCycle.length = 30;
    }

    if (granularity === 'Month') {
      this.selectedCycle.monthly = true;
      this.selectedCycle.length = 1;
    }
  }

}
