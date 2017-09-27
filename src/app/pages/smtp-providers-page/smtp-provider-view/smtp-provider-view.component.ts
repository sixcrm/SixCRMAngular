import {Component, OnInit, OnDestroy} from '@angular/core';
import {SmtpProvidersService} from '../../../shared/services/smtp-providers.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'smtp-provider-view',
  templateUrl: './smtp-provider-view.component.html',
  styleUrls: ['./smtp-provider-view.component.scss']
})
export class SmtpProviderViewComponent extends AbstractEntityViewComponent<SmtpProvider> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  formInvalid: boolean;

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
