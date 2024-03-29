import {Component, OnInit, Input} from '@angular/core';
import {SmtpProvider} from '../../../../shared/models/smtp-provider.model';
import {isAllowedEmail, isValidEmail} from '../../../../shared/utils/form.utils';
import {extractData} from '../../../../shared/services/http-wrapper.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {SmtpProvidersService} from '../../../../entity-services/services/smtp-providers.service';

@Component({
  selector: 'smtp-provider-validate',
  templateUrl: './smtp-provider-validate.component.html',
  styleUrls: ['./smtp-provider-validate.component.scss']
})
export class SmtpProviderValidateComponent implements OnInit {

  @Input() entity: SmtpProvider;

  validationEmail: string;

  validationInProgress: boolean;
  validationResponse: string;
  validationSuccess: boolean;

  emailInvalid: boolean;

  constructor(private smtpService: SmtpProvidersService) { }

  ngOnInit() {
  }

  validEmail(): boolean {
    return isValidEmail(this.validationEmail);
  }

  validateProvider(): void {
    this.emailInvalid = !this.validEmail();
    if (this.emailInvalid) return;

    this.validationInProgress = true;
    this.smtpService.validate(this.entity, this.validationEmail).subscribe(data => {
      this.validationInProgress = false;

      if (data instanceof CustomServerError) return;

      const response = extractData(data).smtpvalidation.smtp_response;
      this.validationResponse = JSON.stringify(response);
      this.validationSuccess = !response.error;
    });
  }

  checkKey(key, value) {
    if (key.code === 'Enter') {
      this.validateProvider();
      return true;
    }

    return isAllowedEmail(key, value);
  }

  copyUrlToClipboard(urlField): void {
    urlField.select();
    document.execCommand('copy');
  }
}
