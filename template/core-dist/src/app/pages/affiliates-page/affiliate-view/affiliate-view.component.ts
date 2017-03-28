import { Component, OnInit } from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Affiliate} from '../../../shared/models/affiliate.model';
import {AffiliatesService} from '../../../shared/services/affiliates.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'affiliate-view',
  templateUrl: './affiliate-view.component.html',
  styleUrls: ['./affiliate-view.component.scss']
})
export class AffiliateViewComponent extends AbstractEntityViewComponent<Affiliate> implements OnInit {

  constructor(service: AffiliatesService, route: ActivatedRoute, progressBarService: ProgressBarService) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.init();
  }

}
