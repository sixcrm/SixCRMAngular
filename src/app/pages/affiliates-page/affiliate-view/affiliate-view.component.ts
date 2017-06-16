import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Affiliate} from '../../../shared/models/affiliate.model';
import {AffiliatesService} from '../../../shared/services/affiliates.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'affiliate-view',
  templateUrl: './affiliate-view.component.html',
  styleUrls: ['./affiliate-view.component.scss']
})
export class AffiliateViewComponent extends AbstractEntityViewComponent<Affiliate> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  editMode: boolean = false;

  constructor(service: AffiliatesService, route: ActivatedRoute, progressBarService: ProgressBarService, public navigation: NavigationService) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());
  }

  ngOnDestroy() {
    this.destroy()
  }

  cancelEdit() {
    this.editMode = false;
    this.cancelUpdate();
  }

  updateAffiliate() {
    this.service.entityUpdated$.take(1).subscribe(() => this.editMode = false);
    this.updateEntity(this.entity);
  }

  setIndex(value: number) {
    this.selectedIndex = value;
  }
}
