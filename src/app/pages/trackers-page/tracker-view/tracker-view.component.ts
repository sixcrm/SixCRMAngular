import {Component, OnInit, OnDestroy} from '@angular/core';
import {Tracker} from '../../../shared/models/tracker.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {TrackersService} from '../../../shared/services/trackers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {NavigationService} from '../../../navigation/navigation.service';
import {firstIndexOf} from '../../../shared/utils/array-utils';
import {Affiliate} from '../../../shared/models/affiliate.model';
import {DeleteDialogComponent} from '../../delete-dialog.component';
import {MdDialog, MdDialogRef} from '@angular/material';

@Component({
  selector: 'tracker-view',
  templateUrl: './tracker-view.component.html',
  styleUrls: ['./tracker-view.component.scss']
})
export class TrackerViewComponent  extends AbstractEntityViewComponent<Tracker> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  editMode: boolean = false;

  deleteDialogRef: MdDialogRef<DeleteDialogComponent>;

  constructor(
    service: TrackersService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService,
    public navigation: NavigationService,
    private deleteDialog: MdDialog,
    private router: Router
  ) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new Tracker();
    }
  }

  ngOnDestroy() {
    this.destroy()
  }

  saveTracker(): void {
    this.service.entityCreated$.take(1).subscribe(tracker => {
      this.progressBarService.hideTopProgressBar();
      this.router.navigate(['trackers', tracker.id]);
      this.entity = tracker;
    });
    this.saveEntity(this.entity);
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

  associateAffiliate(affiliate: Affiliate): void {
    this.cancelEdit();

    this.entity.affiliates.push(affiliate);
    this.updateTracker();
  }

  dissociateAffiliate(affiliate: Affiliate): void {
    this.deleteDialogRef = this.deleteDialog.open(DeleteDialogComponent, { disableClose : true });
    this.deleteDialogRef.componentInstance.text = `Are you sure you want to dissociate ${affiliate.name}?`;

    this.deleteDialogRef.afterClosed().take(1).subscribe(result => {
      this.deleteDialogRef = null;
      if (result.success) {
        let index = firstIndexOf(this.entity.affiliates, (el) => el.id === affiliate.id);

        if (index >= 0) {
          this.progressBarService.showTopProgressBar();
          this.entity.affiliates.splice(index, 1);
          this.service.updateEntity(this.entity);
        }
      }
    });
  }
}

