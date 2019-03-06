import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {ProductScheduleCycles, Cycle} from '../../../models/product-schedule-cycles';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  days = 366;

  cellwidth: number = 65;
  cellheight: number = 46;
  zoom = 5;
  measureArray: number[] = [];

  @Input() set zoomLevel(zoom) {
    this.zoom = zoom;
    this.measureArray = this.createRangeArray(this.days / this.zoom);
  }

  @Input() productSchedule: ProductScheduleCycles;

  @Output() cycleSelected: EventEmitter<Cycle> = new EventEmitter();

  startX: number;

  constructor() { }

  ngOnInit() { }

  createRangeArray(count: number): number[] {
    let temp = [];

    for (let i = 0; i <= count; i++) {
      temp.push(i);
    }

    return temp;
  }

  selectCycle(cycle) {
    for (let i = 0; i < this.productSchedule.cycles.length; i++) {
      if (this.productSchedule.cycles[i] === cycle) {
        cycle['selected'] = !cycle['selected'];
      } else {
        this.productSchedule.cycles[i]['selected'] = false;
      }
    }

    this.cycleSelected.emit(this.productSchedule.cycles.find(cycle => cycle['selected']));
  }

  dragResizeStarted(event) {
    this.startX = event.clientX;
  }

  dragResize(event, cycle: Cycle) {
    if (event.clientX === 0) return;

    cycle.dragDiff = Math.floor((event.clientX - this.startX) / (this.cellwidth / this.zoom));
  }

  dragResizeEnded(cycle: Cycle) {
    cycle.length += cycle.dragDiff;
    cycle.dragDiff = 0;
  }

  cyclesReorganized(event: CdkDragDrop<any>) {
    const fromIndex = event.previousIndex;
    const toIndex = event.currentIndex;

    const temp = this.productSchedule.cycles[fromIndex];

    this.productSchedule.cycles[fromIndex] = this.productSchedule.cycles[toIndex];
    this.productSchedule.cycles[toIndex] = temp;
  }
}
