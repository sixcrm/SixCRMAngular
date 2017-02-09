import { Component, OnInit } from '@angular/core';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {SmtpProvidersService} from '../../shared/services/smtp-providers.service';
import {Router, ActivatedRoute} from '@angular/router';
import {SmtpProvider} from '../../shared/models/smtp-provider.model';
import {MdDialog} from '@angular/material';

@Component({
  selector: 'c-smtp-providers',
  templateUrl: './smtp-providers.component.html',
  styleUrls: ['./smtp-providers.component.scss']
})
export class SmtpProvidersComponent extends AbstractEntityIndexComponent<SmtpProvider> implements OnInit {

  private smtpProviders: SmtpProvider[] = [];

  constructor(private smtpProvidersService: SmtpProvidersService, router: Router, route: ActivatedRoute, dialog: MdDialog) {
    super(smtpProvidersService, router, route, dialog);
  }

  ngOnInit() {
    this.smtpProvidersService.entities$.subscribe((data) => this.smtpProviders = data);
    this.smtpProvidersService.entityDeleted$.subscribe((data) => this.smtpProvidersService.getEntities());
    this.smtpProvidersService.getEntities();
  }

}
