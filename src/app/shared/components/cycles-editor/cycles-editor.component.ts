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
    const selectedPosition = firstIndexOf(this.productSchedule.cycles, cycle => cycle['selected']);

    if (selectedPosition === -1 || selectedPosition === this.productSchedule.cycles.length - 1) {
      const lastCycle = this.productSchedule.cycles[this.productSchedule.cycles.length - 1];
      const nextPosition = lastCycle.nextPosition === lastCycle.position ? lastCycle.nextPosition + 1 : lastCycle.nextPosition;

      const newCycle = lastCycle.copy();
      newCycle.position = newCycle.position + 1;
      newCycle.nextPosition = nextPosition;

      lastCycle.nextPosition = newCycle.position;
      this.productSchedule.cycles.push(newCycle);
    } else {
      const afterCycle = this.productSchedule.cycles[selectedPosition];
      const newCycle = afterCycle.copy();

      this.productSchedule.cycles.splice(selectedPosition + 1, 0, newCycle);

      for (let i = selectedPosition + 1; i < this.productSchedule.cycles.length; i++) {
        if (i === this.productSchedule.cycles.length - 1) {
          this.productSchedule.cycles[i].nextPosition =
            this.productSchedule.cycles[i].position === this.productSchedule.cycles[i].nextPosition
              ? this.productSchedule.cycles[i].nextPosition + 1
              : this.productSchedule.cycles[i].nextPosition;

          this.productSchedule.cycles[i].position = this.productSchedule.cycles[i].position + 1;
        } else {
          this.productSchedule.cycles[i].position = this.productSchedule.cycles[i].position + 1;
          this.productSchedule.cycles[i].nextPosition = this.productSchedule.cycles[i].nextPosition + 1;
        }
      }
    }
  }

  deleteSelectedCycle(selected: Cycle) {
    const deletePosition = firstIndexOf(this.productSchedule.cycles, cycle => cycle['selected']);

    if (deletePosition === -1) return;

    if (deletePosition === this.productSchedule.cycles.length - 1) {
      this.productSchedule.cycles[this.productSchedule.cycles.length - 2].nextPosition = -1;
      this.productSchedule.cycles.splice(deletePosition);
    } else {
      for (let i = deletePosition; i < this.productSchedule.cycles.length; i++) {

        if (i === this.productSchedule.cycles.length - 1) {

          this.productSchedule.cycles[i].nextPosition =
            this.productSchedule.cycles[i].position === this.productSchedule.cycles[i].nextPosition
              ? this.productSchedule.cycles[i].nextPosition - 1
              : this.productSchedule.cycles[i].nextPosition;

        } else {
          this.productSchedule.cycles[i].nextPosition = this.productSchedule.cycles[i].nextPosition - 1;
        }

        this.productSchedule.cycles[i].position = this.productSchedule.cycles[i].position - 1;
      }

      this.productSchedule.cycles.splice(deletePosition, 1);
    }

    this.selectedCycle = undefined;
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

  nextCycleChanged(data: {cycle: Cycle, nextCycle: number}) {
    data.cycle.nextPosition = data.nextCycle;
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

  reorganizeCycles(data: {fromIndex: number, toIndex: number}) {
    const {fromIndex, toIndex} = data;

    if (fromIndex === toIndex) return;

    if (fromIndex < toIndex) {
      for (let i = fromIndex; i < toIndex; i++) {
        this.switchCyclePositions(i, i+1);
      }
    }

    if (fromIndex > toIndex) {
      for (let i = fromIndex; i > toIndex; i--) {
        this.switchCyclePositions(i, i-1);
      }
    }

  }

  switchCyclePositions(fromIndex: number, toIndex: number) {
    const fromPosition = this.productSchedule.cycles[fromIndex].position;
    const fromNextPosition = this.productSchedule.cycles[fromIndex].nextPosition;

    const toPosition = this.productSchedule.cycles[toIndex].position;
    const toNextPosition = this.productSchedule.cycles[toIndex].nextPosition;

    const temp = this.productSchedule.cycles[fromIndex];

    this.productSchedule.cycles[fromIndex] = this.productSchedule.cycles[toIndex];
    this.productSchedule.cycles[toIndex] = temp;

    this.productSchedule.cycles[fromIndex].position = fromPosition;
    this.productSchedule.cycles[fromIndex].nextPosition = fromNextPosition;

    this.productSchedule.cycles[toIndex].position = toPosition;
    this.productSchedule.cycles[toIndex].nextPosition = toNextPosition;
  }
}
