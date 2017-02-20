import {Component, OnInit, OnDestroy} from '@angular/core';
import {Affiliate} from '../../../shared/models/affiliate.model';
import {AffiliatesService} from '../../../shared/services/affiliates.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-affiliates-view',
  templateUrl: './affiliates-view.component.html',
  styleUrls: ['./affiliates-view.component.scss']
})
export class AffiliatesViewComponent extends AbstractEntityViewComponent<Affiliate> implements OnInit, OnDestroy {

  constructor(
    private affiliatesService: AffiliatesService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(affiliatesService, route, progressBarService);
  }

  ngOnInit() {
    if (this.addMode) {
      this.entity = new Affiliate();
    }

    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
