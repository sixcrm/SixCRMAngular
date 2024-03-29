import {Component, OnInit, OnDestroy} from '@angular/core';
import {SessionsService} from "../../../entity-services/services/sessions.service";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {Session} from '../../../shared/models/session.model';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';

@Component({
  selector: 'sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent extends AbstractEntityIndexComponent<Session> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'SESSION_INDEX_TITLE'}];

  constructor(
    sessionsService: SessionsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(sessionsService, auth, dialog, paginationService, router, activatedRoute);

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('SESSION_INDEX_HEADER_ID', (e: Session) => e.id).setSelected(false),
      new ColumnParams('SESSION_INDEX_HEADER_ALIAS', (e: Session) => e.alias),
      new ColumnParams('SESSION_INDEX_HEADER_CUSTOMER', (e: Session) => e.customer.firstName + ' ' + e.customer.lastName),
      new ColumnParams('SESSION_INDEX_HEADER_CAMPAIGN',(e: Session) => e.campaign.name),
      new ColumnParams('SESSION_INDEX_HEADER_REBILLSNUM', (e: Session) => e.rebills.length.toString(), 'right').setNumberOption(true),
      new ColumnParams('SESSION_INDEX_HEADER_CREATED', (e: Session) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('SESSION_INDEX_HEADER_UPDATED', (e: Session) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  viewEntity(id: string) {
    this.router.navigate(['/customers/advanced'], {queryParams: {session: id}});
  }
}
