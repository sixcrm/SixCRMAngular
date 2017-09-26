import {Component, OnInit, OnDestroy} from '@angular/core';
import {SmtpProvidersService} from '../../../shared/services/smtp-providers.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';
import {NavigationService} from '../../../navigation/navigation.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {extractData} from '../../../shared/services/http-wrapper.service';

@Component({
  selector: 'smtp-provider-view',
  templateUrl: './smtp-provider-view.component.html',
  styleUrls: ['./smtp-provider-view.component.scss']
})
export class SmtpProviderViewComponent extends AbstractEntityViewComponent<SmtpProvider> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  formInvalid: boolean;
  validationEmail: string;

  validationInProgress: boolean;
  validationMessage: string;
  validationSuccess: boolean;

  constructor(private smtpService: SmtpProvidersService,
              route: ActivatedRoute,
              public navigation: NavigationService
  ) {
    super(smtpService, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());
  }

  validateProvider(): void {
    if (!this.validationEmail) return;

    this.validationInProgress = true;
    this.smtpService.validate(this.entity, this.validationEmail).subscribe(data => {
      this.validationInProgress = false;

      if (data instanceof CustomServerError) return;

      const response = extractData(data).smtpvalidation.smtp_response;
      this.validationMessage = response.errormessage ? `SMTP Validation Failed! ERROR: ${response.errormessage}` : 'SMTP Validation Successful!';
      this.validationSuccess = !response.errormessage;
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }

}
