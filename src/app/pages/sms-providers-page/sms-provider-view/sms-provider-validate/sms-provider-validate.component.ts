import {Component, OnInit, Input} from '@angular/core';
import {SmsProvider} from '../../../../shared/models/sms-provider.model';
import {extractData} from '../../../../shared/services/http-wrapper.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {SmsProvidersService} from '../../../../entity-services/services/sms-providers.service';

@Component({
  selector: 'sms-provider-validate',
  templateUrl: './sms-provider-validate.component.html',
  styleUrls: ['./sms-provider-validate.component.scss']
})
export class SmsProviderValidateComponent implements OnInit {

  @Input() entity: SmsProvider;

  validationPhoneNumber: string;

  validationInProgress: boolean;
  validationResponse: string;
  validationSuccess: boolean;

  constructor(private smsService: SmsProvidersService) { }

  ngOnInit() {
  }

  validateProvider(): void {
    this.validationInProgress = true;

    this.smsService.validate(this.entity, this.validationPhoneNumber).subscribe(data => {
      this.validationInProgress = false;

      if (data instanceof CustomServerError) return;

      const response = extractData(data).smsvalidation.sms_response;
      this.validationSuccess = response.success;
      this.validationResponse = this.validationSuccess ? `SMS successfully sent` : `${response.message.message} STATUS: ${response.message.status}, CODE: ${response.message.code}`;
    });
  }

  copyUrlToClipboard(urlField): void {
    urlField.select();
    document.execCommand('copy');
  }
}
