import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {SmtpProvidersService} from '../../shared/services/smtp-providers.service';
import {SmtpProvider} from '../../shared/models/smtp-provider.model';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';

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
    progressBarService: ProgressBarService,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(smtpProvidersService, auth, dialog, progressBarService, paginationService, router, activatedRoute);
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
