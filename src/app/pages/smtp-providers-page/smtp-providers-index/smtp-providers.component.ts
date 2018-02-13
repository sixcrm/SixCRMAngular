import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {SmtpProvidersService} from '../../../shared/services/smtp-providers.service';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';

@Component({
  selector: 'c-smtp-providers',
  templateUrl: './smtp-providers.component.html',
  styleUrls: ['./smtp-providers.component.scss']
})
export class SmtpProvidersComponent extends AbstractEntityIndexComponent<SmtpProvider> implements OnInit, OnDestroy {

  constructor(
    smtpProvidersService: SmtpProvidersService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(smtpProvidersService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new SmtpProvider();

    this.columnParams = [
      new ColumnParams('SMTP_INDEX_HEADER_NAME', (e: SmtpProvider) => e.name),
      new ColumnParams('SMTP_INDEX_HEADER_FROMNAME',(e: SmtpProvider) => e.fromName),
      new ColumnParams('SMTP_INDEX_HEADER_FROMEMAIL',(e: SmtpProvider) => e.fromEmail),
      new ColumnParams('SMTP_INDEX_HEADER_HOSTNAME',(e: SmtpProvider) => e.hostname),
      new ColumnParams('SMTP_INDEX_HEADER_USERNAME', (e: SmtpProvider) => e.username),
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
