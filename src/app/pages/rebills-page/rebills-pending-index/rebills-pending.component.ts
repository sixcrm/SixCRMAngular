import {Component, OnInit, OnDestroy} from '@angular/core';
import {RebillsService} from '../../../entity-services/services/rebills.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PaginationService} from '../../../shared/services/pagination.service';
import {RebillsComponent} from "../rebills-index/rebills.component";
import {rebillsListQuery, rebillsPendingListQuery} from "../../../shared/utils/queries/entities/rebill.queries";
import {MatDialog} from '@angular/material';

@Component({
  selector: 'rebills-pending',
  templateUrl: './../rebills-index/rebills.component.html',
  styleUrls: ['./../rebills-index/rebills.component.scss']
})
export class RebillsPendingComponent extends RebillsComponent implements OnInit, OnDestroy {

  constructor(
    service: RebillsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(service, auth, dialog, paginationService, router, activatedRoute);
  }

  ngOnInit() {
    this.service.indexQuery = rebillsPendingListQuery;
    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = rebillsListQuery;
    this.destroy();
  }

  viewEntity(id: string) {
    this.router.navigate(['/customers/advanced'], {queryParams: {order: id}});
  }
}