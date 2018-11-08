import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'schedule-detailed-header',
  templateUrl: './schedule-detailed-header.component.html',
  styleUrls: ['./schedule-detailed-header.component.scss']
})
export class ScheduleDetailedHeaderComponent implements OnInit {

  @Input() zoomLevel: number;
  @Input() sideVisible: boolean;
  @Input() singleScheduleMode: boolean;
  @Input() undoEnabled: boolean = true;
  @Input() redoEnabled: boolean = true;
  @Input() infoEnabled: boolean = true;
  @Input() statusMessage: string;
  @Input() editable: boolean = true;

  @Output() zoomChanged: EventEmitter<number> = new EventEmitter();
  @Output() filterChanged: EventEmitter<string> = new EventEmitter();
  @Output() sideVisibleChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() infoEnabledChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() undo: EventEmitter<boolean> = new EventEmitter();
  @Output() redo: EventEmitter<boolean> = new EventEmitter();
  @Output() revert: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  mouseWheel(event) {
    if (event.deltaY > 0) {
      if (this.zoomLevel <= 1) return;

      this.zoomChanged.emit(this.zoomLevel - 1)
    } else if (event.deltaY < 0) {
      if (this.zoomLevel >= 10) return;

      this.zoomChanged.emit(this.zoomLevel + 1)
    }

    event.preventDefault();
  }

  doUndo() {
    if (!this.undoEnabled) return;

    this.undo.emit(true)
  }

  doRevert() {
    if (!this.undoEnabled) return;

    this.revert.emit(true);
  }

  doRedo() {
    if (!this.redoEnabled) return;

    this.redo.emit(true)
  }
}
