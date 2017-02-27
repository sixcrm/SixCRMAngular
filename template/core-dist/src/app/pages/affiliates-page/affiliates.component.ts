import { Component, OnInit } from '@angular/core';
import {AffiliatesService} from "../../shared/services/affiliates.service";
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Affiliate} from '../../shared/models/affiliate.model';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';

@Component({
  selector: 'affiliates',
  templateUrl: './affiliates.component.html',
  styleUrls: ['./affiliates.component.scss']
})
export class AffiliatesComponent extends AbstractEntityIndexComponent<Affiliate> implements OnInit {

  constructor(
    private affiliatesService: AffiliatesService,
    router: Router,
    route: ActivatedRoute,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(affiliatesService, router, route, dialog, progressBarService, paginationService);
  }

  ngOnInit() {
    this.affiliatesService.entityDeleted$.subscribe((data) => this.affiliatesService.getEntities());

    this.init();
  }
}
