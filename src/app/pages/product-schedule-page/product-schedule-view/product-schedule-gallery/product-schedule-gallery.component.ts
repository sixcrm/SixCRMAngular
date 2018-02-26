import {Component, OnInit, Input} from '@angular/core';
import {Schedule} from '../../../../shared/models/schedule.model';

@Component({
  selector: 'product-schedule-gallery',
  templateUrl: './product-schedule-gallery.component.html',
  styleUrls: ['./product-schedule-gallery.component.scss']
})
export class ProductScheduleGalleryComponent implements OnInit {

  @Input() schedules: Schedule[] = [];

  constructor() { }

  ngOnInit() {
  }

}
