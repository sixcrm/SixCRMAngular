import {Component, OnInit, OnDestroy} from '@angular/core';
import {SmsProvidersService} from '../../../entity-services/services/sms-providers.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {SmsProvider} from '../../../shared/models/sms-provider.model';
import {NavigationService} from '../../../navigation/navigation.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';

@Component({
  selector: 'sms-provider-view',
  templateUrl: './sms-provider-view.component.html',
  styleUrls: ['./sms-provider-view.component.scss']
})
export class SmsProviderViewComponent extends AbstractEntityViewComponent<SmsProvider> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  formInvalid: boolean;

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'GENERAL'},
    {name: 'validate', label: 'VALIDATE'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'SMS Providers', url: '/smsproviders'},
    {label: () => this.entity.name}
  ];

  constructor(private smsService: SmsProvidersService,
              route: ActivatedRoute,
              public navigation: NavigationService
  ) {
    super(smsService, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }

}
