import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {CustomerEventsComponent} from '../../../customers-page/customer-view/customer-events/customer-events.component';
import {AnalyticsService} from '../../../../shared/services/analytics.service';

@Component({
  selector: 'events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss']
})
export class EventsTableComponent extends CustomerEventsComponent implements OnInit, OnDestroy {

  @Output() addNoteClicked: EventEmitter<boolean> = new EventEmitter();

  filterValue: string;

  constructor(service: AnalyticsService) {
    super(service);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
