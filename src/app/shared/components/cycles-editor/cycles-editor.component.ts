import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ProductSchedule, Cycle, CycleProduct} from '../../models/product-schedule.model';
import {firstIndexOf} from '../../utils/array.utils';

@Component({
  selector: 'cycles-editor',
  templateUrl: './cycles-editor.component.html',
  styleUrls: ['./cycles-editor.component.scss'],
  host: {'(document:keydown)':'onKeyDown($event)'}
})
export class CyclesEditorComponent implements OnInit {

  @Input()
  public productSchedule: ProductSchedule;

  @Output() saveChanges: EventEmitter<ProductSchedule> = new EventEmitter();
  @Output() undoChanges: EventEmitter<boolean> = new EventEmitter();
  @Output() redoChanges: EventEmitter<boolean> = new EventEmitter();
  @Output() cancelChanges: EventEmitter<boolean> = new EventEmitter();

  editMode: boolean;

  public zoomLevel: number = 5;

  public selectedCycle: Cycle;
  public cycleProducts: CycleProduct[];

  constructor() { }

  ngOnInit() {
    this.cycleProducts = this.productSchedule.cycles
      .map(cycle => cycle.cycleProducts)
      .reduce((a,b) => a.concat(...b), [])
      .reduce((a,b) => firstIndexOf(a, el => el.product.id === b.product.id) === -1 ? a.concat(b) : a, []);
  }

  addNewCycle() {
    const selectedPosition = firstIndexOf(this.productSchedule.cycles, cycle => cycle['selected']);

    const cycle = selectedPosition === -1 ? this.productSchedule.cycles[this.productSchedule.cycles.length - 1] : this.productSchedule.cycles[selectedPosition];
    const lastCycle = this.productSchedule.cycles[this.productSchedule.cycles.length - 1];
    const position = lastCycle.position + 1;
    const nextPosition = lastCycle.nextPosition === lastCycle.position ? lastCycle.nextPosition + 1 : lastCycle.nextPosition;
    lastCycle.nextPosition = position;

    for (let i = 0; i < this.productSchedule.cycles.length; i++) {
      this.productSchedule.cycles[i]['selected'] = false;
    }

    const newCycle = cycle.copy();
    newCycle.position = position;
    newCycle.nextPosition = nextPosition;
    newCycle['selected'] = true;

    this.selectedCycle = newCycle;
    this.productSchedule.cycles.push(newCycle);
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
    for (let i = 0; i < this.productSchedule.cycles.length; i++) {
      if (this.productSchedule.cycles[i] === selectedCycle) {
        selectedCycle['selected'] = !selectedCycle['selected'];
      } else {
        this.productSchedule.cycles[i]['selected'] = false;
      }
    }

    this.selectedCycle = selectedCycle['selected'] ? selectedCycle : undefined;
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

  save() {
    for (let i = 0; i < this.productSchedule.cycles.length; i++) {
      if (!this.productSchedule.cycles[i].isValid()) {
        this.cycleSelected(this.productSchedule.cycles[i]);

        return;
      }
    }

    const snapshot = this.productSchedule.copy();
    this.selectedCycle = undefined;

    this.saveChanges.emit(snapshot);
  }

  undo() {
    this.undoChanges.emit(true);
  }

  redo() {
    this.redoChanges.emit(true);
  }

  cancelUpdates() {
    this.editMode = false;
    this.selectedCycle = undefined;
    this.cancelChanges.emit(true);
  }

  onKeyDown(event) {
    if (event && event.key === 'Escape' || event.code == 'Escape') {
      for (let i = 0; i < this.productSchedule.cycles.length; i++) {
        this.productSchedule.cycles[i]['selected'] = false
      }

      this.selectedCycle = undefined;
    }
  }
}
