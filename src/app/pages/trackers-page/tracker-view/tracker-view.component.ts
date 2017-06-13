import {Component, OnInit, OnDestroy} from '@angular/core';
import {Tracker} from '../../../shared/models/tracker.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {TrackersService} from '../../../shared/services/trackers.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'tracker-view',
  templateUrl: './tracker-view.component.html',
  styleUrls: ['./tracker-view.component.scss']
})
export class TrackerViewComponent  extends AbstractEntityViewComponent<Tracker> implements OnInit, OnDestroy {

  selectedIndex: number = 1;

  constructor(service: TrackersService, route: ActivatedRoute, progressBarService: ProgressBarService, public navigation: NavigationService) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy()
  }

}

