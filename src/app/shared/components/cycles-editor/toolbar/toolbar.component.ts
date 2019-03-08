import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() zoomLevel: number;
  @Input() statePersisted: boolean;

  @Output() zoomLevelChanged: EventEmitter<number> = new EventEmitter();
  @Output() save: EventEmitter<boolean> = new EventEmitter();
  @Output() undo: EventEmitter<boolean> = new EventEmitter();
  @Output() redo: EventEmitter<boolean> = new EventEmitter();
  @Output() revert: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  mouseWheel(event) {
    if (event.deltaY > 0) {
      if (this.zoomLevel <= 1) return;

      this.zoomLevelChanged.emit(this.zoomLevel - 1)
    } else if (event.deltaY < 0) {
      if (this.zoomLevel >= 10) return;

      this.zoomLevelChanged.emit(this.zoomLevel + 1)
    }

    event.preventDefault();
  }

}
