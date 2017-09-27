import {Component, OnInit, Input} from '@angular/core';
import {SmtpProvider} from '../../../../shared/models/smtp-provider.model';
import {isAllowedEmail} from '../../../../shared/utils/form.utils';
import {extractData} from '../../../../shared/services/http-wrapper.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {SmtpProvidersService} from '../../../../shared/services/smtp-providers.service';

@Component({
  selector: 'smtp-provider-validate',
  templateUrl: './smtp-provider-validate.component.html',
  styleUrls: ['./smtp-provider-validate.component.scss']
})
export class SmtpProviderValidateComponent implements OnInit {

  @Input() entity: SmtpProvider;

  isEmail = isAllowedEmail;

  validationEmail: string;

  validationInProgress: boolean;
  validationMessage: string;
  validationSuccess: boolean;
  validationFinished: boolean;

  constructor(private smtpService: SmtpProvidersService) { }

  ngOnInit() {
  }

  validateProvider(): void {
    if (!this.validationEmail) return;

    this.validationInProgress = true;
    this.smtpService.validate(this.entity, this.validationEmail).subscribe(data => {
      this.validationInProgress = false;

      if (data instanceof CustomServerError) return;

      const response = extractData(data).smtpvalidation.smtp_response;
      this.validationMessage = response.errormessage;
      this.validationSuccess = !response.errormessage;
      this.validationFinished = true;
    });
  }

  copyUrlToClipboard(urlField): void {
    urlField.select();
    document.execCommand('copy');
  }
}
