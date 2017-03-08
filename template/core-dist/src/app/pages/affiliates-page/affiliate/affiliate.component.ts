import { Component, OnInit } from '@angular/core';
import {AbstractEntityComponent} from '../../abstract-entity-component';
import {Affiliate} from '../../../shared/models/affiliate.model';
import {AffiliatesService} from '../../../shared/services/affiliates.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'affiliate',
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.scss']
})
export class AffiliateComponent extends AbstractEntityComponent<Affiliate> implements OnInit {

  constructor(service: AffiliatesService, progressBarService: ProgressBarService) {
    super(service, progressBarService)
  }

  ngOnInit() {
    this.init();
  }

}
