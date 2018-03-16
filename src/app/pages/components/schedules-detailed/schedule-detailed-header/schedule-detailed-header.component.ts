import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {DisplayModes} from '../schedules-detailed.component';

@Component({
  selector: 'schedule-detailed-header',
  templateUrl: './schedule-detailed-header.component.html',
  styleUrls: ['./schedule-detailed-header.component.scss']
})
export class ScheduleDetailedHeaderComponent implements OnInit {

  @Input() displayMode: DisplayModes;
  @Input() zoomLevel: number;
  @Input() sideVisible: boolean;

  @Output() zoomChanged: EventEmitter<number> = new EventEmitter();
  @Output() filterChanged: EventEmitter<string> = new EventEmitter();
  @Output() displayModeChanged: EventEmitter<DisplayModes> = new EventEmitter();
  @Output() sideVisibleChanged: EventEmitter<boolean> = new EventEmitter();

  modes = DisplayModes;

  constructor() { }

  ngOnInit() {
  }
}
