import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {SmtpProvidersService} from '../../../entity-services/services/smtp-providers.service';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';
import {BreadcrumbItem} from "../../components/models/breadcrumb-item.model";

@Component({
  selector: 'c-smtp-providers',
  templateUrl: './smtp-providers.component.html',
  styleUrls: ['./smtp-providers.component.scss']
})
export class SmtpProvidersComponent extends AbstractEntityIndexComponent<SmtpProvider> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'SMTP_INDEX_TITLE'}];

  constructor(
    smtpProvidersService: SmtpProvidersService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(smtpProvidersService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new SmtpProvider();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('SMTP_INDEX_HEADER_ID', (e: SmtpProvider) => e.id).setSelected(false),
      new ColumnParams('SMTP_INDEX_HEADER_NAME', (e: SmtpProvider) => e.name),
      new ColumnParams('SMTP_INDEX_HEADER_FROMNAME',(e: SmtpProvider) => e.fromName),
      new ColumnParams('SMTP_INDEX_HEADER_FROMEMAIL',(e: SmtpProvider) => e.fromEmail),
      new ColumnParams('SMTP_INDEX_HEADER_HOSTNAME',(e: SmtpProvider) => e.hostname),
      new ColumnParams('SMTP_INDEX_HEADER_USERNAME', (e: SmtpProvider) => e.username),
      new ColumnParams('SMTP_INDEX_HEADER_PORT', (e: SmtpProvider) => e.port).setSelected(false),
      new ColumnParams('SMTP_INDEX_HEADER_CREATED', (e: SmtpProvider) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('SMTP_INDEX_HEADER_UPDATED', (e: SmtpProvider) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
