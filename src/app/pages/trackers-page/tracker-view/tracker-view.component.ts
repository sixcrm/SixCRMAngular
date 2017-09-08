import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Tracker} from '../../../shared/models/tracker.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {TrackersService} from '../../../shared/services/trackers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {Affiliate} from '../../../shared/models/affiliate.model';
import 'codemirror/mode/htmlmixed/htmlmixed';
import {CodemirrorComponent} from 'ng2-codemirror';
import {AffiliatesService} from '../../../shared/services/affiliates.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'tracker-view',
  templateUrl: './tracker-view.component.html',
  styleUrls: ['./tracker-view.component.scss']
})
export class TrackerViewComponent  extends AbstractEntityViewComponent<Tracker> implements OnInit, OnDestroy {

  @ViewChild(CodemirrorComponent) codemirrorComponent: CodemirrorComponent;

  selectedIndex: number = 0;

  config = {
    lineNumbers: true,
    mode: {
      name: "htmlmixed"
    },
    readOnly: true
  };

  affiliateMapper = (el: Affiliate) => el.name;
  affiliateColumnParams: ColumnParams<Affiliate>[];

  constructor(
    service: TrackersService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public affiliateService: AffiliatesService,
    public authService: AuthenticationService,
    private router: Router
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new Tracker();
      this.entityBackup = this.entity.copy();
      this.affiliateService.getEntities();
    } else {
      this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe(() => this.affiliateService.getEntities());
    }

    let f = this.authService.getTimezone();
    this.affiliateColumnParams = [
      new ColumnParams('Name', (e: Affiliate) => e.name),
      new ColumnParams('Affiliate ID', (e: Affiliate) => e.affiliateId),
      new ColumnParams('Created At', (e: Affiliate) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('Updated At', (e: Affiliate) => e.updatedAt.tz(f).format('MM/DD/YYYY'))
    ];
  }

  ngOnDestroy() {
    this.destroy()
  }

  saveTracker(): void {
    this.service.entityCreated$.take(1).subscribe(tracker => {
      if (tracker instanceof CustomServerError) return;

      this.router.navigate(['trackers', tracker.id]);
      this.entity = tracker;
    });
    this.saveEntity(this.entity);
  }

  setIndex(value: number) {
    this.selectedIndex = value;
  }

  cancelEdit() {
    this.setMode(this.modes.View);
    if (this.codemirrorComponent) {
      this.codemirrorComponent.instance.setOption('readOnly', true);
    }
    this.cancelUpdate();
  }

  enableEdit() {
    this.setMode(this.modes.Update);
    if (this.codemirrorComponent) {
      this.codemirrorComponent.instance.setOption('readOnly', false);
    }
  }

  setType(type: string) {
    this.entity.type = type;
    this.codemirrorComponent.instance.setOption('readOnly', false);
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
    this.service.entityUpdated$.take(1).subscribe(() => {
      this.setMode(this.modes.View);
    });
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
    let index = firstIndexOf(this.entity.affiliates, (el) => el.id === affiliate.id);

    if (index >= 0) {
      this.entity.affiliates.splice(index, 1);
      this.service.updateEntity(this.entity);
    }
  }

  viewAffiliate(affiliate: Affiliate): void {
    this.router.navigate(['/affiliates', affiliate.id]);
  }
}

