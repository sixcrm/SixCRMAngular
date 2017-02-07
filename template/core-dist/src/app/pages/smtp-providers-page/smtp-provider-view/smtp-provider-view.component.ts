import { Component, OnInit } from '@angular/core';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';
import {SmtpProvidersService} from '../../../shared/services/smtp-providers.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'c-smtp-provider-view',
  templateUrl: './smtp-provider-view.component.html',
  styleUrls: ['./smtp-provider-view.component.scss']
})
export class SmtpProviderViewComponent implements OnInit {

  private smtpProvider: SmtpProvider;

  constructor(private smtpProvidersService: SmtpProvidersService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.smtpProvidersService.entity$.subscribe((data) => this.smtpProvider = data);
    this.route.params.subscribe((params: Params) => this.smtpProvidersService.getEntity(params['id']));
  }
}
