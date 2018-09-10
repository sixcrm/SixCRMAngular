import {Component, OnInit, OnDestroy} from '@angular/core';
import {SmtpProvidersService} from '../../../entity-services/services/smtp-providers.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';
import {NavigationService} from '../../../navigation/navigation.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';

@Component({
  selector: 'smtp-provider-view',
  templateUrl: './smtp-provider-view.component.html',
  styleUrls: ['./smtp-provider-view.component.scss']
})
export class SmtpProviderViewComponent extends AbstractEntityViewComponent<SmtpProvider> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  formInvalid: boolean;

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'SMTP_TAB_GENERAL'},
    // {name: 'templates', label: 'SMTP_TAB_EMAILTEMPLATE'},
    {name: 'validate', label: 'SMTP_TAB_VALIDATE'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'SMTP_INDEX_TITLE', url: '/smtpproviders'},
    {label: () => this.entity.name}
  ];

  constructor(private smtpService: SmtpProvidersService,
              route: ActivatedRoute,
              public navigation: NavigationService
  ) {
    super(smtpService, route);
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
