import {Component, OnInit, OnDestroy} from '@angular/core';
import {Tracker} from '../../../shared/models/tracker.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {TrackersService} from '../../../shared/services/trackers.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {NavigationService} from '../../../navigation/navigation.service';
import {firstIndexOf} from '../../../shared/utils/array-utils';

@Component({
  selector: 'tracker-view',
  templateUrl: './tracker-view.component.html',
  styleUrls: ['./tracker-view.component.scss']
})
export class TrackerViewComponent  extends AbstractEntityViewComponent<Tracker> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  editMode: boolean = false;

  constructor(service: TrackersService, route: ActivatedRoute, progressBarService: ProgressBarService, public navigation: NavigationService) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy()
  }

  setIndex(value: number) {
    this.selectedIndex = value;
  }

  cancelEdit() {
    this.editMode = false;
    this.cancelUpdate();
  }

  removeEventType(type: string) {
    let index = firstIndexOf(this.entity.eventType, (el) => el === type);

    if (index >= 0) {
      this.entity.eventType.splice(index, 1);
    }
  }

  addEventType(type: string) {
    if (firstIndexOf(this.entity.eventType, (el) => el === type) === -1) {
      this.entity.eventType.push(type);
    }
  }

  updateTracker() {
    this.service.entityUpdated$.take(1).subscribe(() => this.editMode = false);
    this.updateEntity(this.entity);
  }

  copyUrlToClipboard(urlField): void {
    urlField.select();
    document.execCommand('copy');
  }
}

