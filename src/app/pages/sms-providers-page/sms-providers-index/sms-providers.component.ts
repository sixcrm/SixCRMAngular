import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {SmsProvidersService} from '../../../entity-services/services/sms-providers.service';
import {SmsProvider} from '../../../shared/models/sms-provider.model';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MatDialog} from '@angular/material';
import {BreadcrumbItem} from "../../components/models/breadcrumb-item.model";
import {Location} from '@angular/common';

@Component({
  selector: 'sms-providers',
  templateUrl: './sms-providers.component.html',
  styleUrls: ['./sms-providers.component.scss']
})
export class SmsProvidersComponent extends AbstractEntityIndexComponent<SmsProvider> implements OnInit, OnDestroy {

  crumbItems: BreadcrumbItem[] = [{label: () => 'SMS Providers'}];

  constructor(
    smsProvidersService: SmsProvidersService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    location: Location
  ) {
    super(smsProvidersService, auth, dialog, paginationService, router, activatedRoute, location);

    this.entityFactory = () => new SmsProvider();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('ID', (e: SmsProvider) => e.id).setSelected(false),
      new ColumnParams('Name', (e: SmsProvider) => e.name),
      new ColumnParams('Type', (e: SmsProvider) => e.type),
      new ColumnParams('From Number', (e: SmsProvider) => e.fromNumber),
      new ColumnParams('Account ID', (e: SmsProvider) => e.apiAccount).setSelected(false),
      new ColumnParams('Created at', (e: SmsProvider) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('Updated at', (e: SmsProvider) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
