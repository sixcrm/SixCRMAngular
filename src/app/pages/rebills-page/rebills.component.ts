import {Component, OnInit, OnDestroy} from '@angular/core';
import {Rebill} from '../../shared/models/rebill.model';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {RebillsService} from '../../shared/services/rebills.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PaginationService} from '../../shared/services/pagination.service';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {MdDialog} from '@angular/material';
import {ColumnParams} from '../../shared/models/column-params.model';

@Component({
  selector: 'rebills',
  templateUrl: './rebills.component.html',
  styleUrls: ['./rebills.component.scss']
})
export class RebillsComponent extends AbstractEntityIndexComponent<Rebill> implements OnInit, OnDestroy {

  constructor(
    service: RebillsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(service, auth, dialog, progressBarService, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('ID', (e: Rebill) => e.id),
      new ColumnParams('Bill At',(e: Rebill) => e.billAt ? e.billAt.format() : 'not billed'),
      new ColumnParams('Created At', (e: Rebill) => e.createdAt.format()),
      new ColumnParams('Amount', (e: Rebill) => e.amount)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
