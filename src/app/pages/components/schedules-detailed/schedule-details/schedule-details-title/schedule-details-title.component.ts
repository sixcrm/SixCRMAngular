import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'schedule-details-title',
  templateUrl: './schedule-details-title.component.html',
  styleUrls: ['./schedule-details-title.component.scss']
})
export class ScheduleDetailsTitleComponent implements OnInit {

  @Input() nextCycle: string;
  @Input() imagePath: string;

  constructor() { }

  ngOnInit() {
  }

}
