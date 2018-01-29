import {Component, OnInit, Input} from '@angular/core';
import {FulfillmentProvidersService} from '../../../../shared/services/fulfillment-providers.service';
import {FulfillmentProvider} from '../../../../shared/models/fulfillment-provider.model';

@Component({
  selector: 'fulfillment-provider-validation',
  templateUrl: './fulfillment-provider-validation.component.html',
  styleUrls: ['./fulfillment-provider-validation.component.scss']
})
export class FulfillmentProviderValidationComponent implements OnInit {

  @Input() entity: FulfillmentProvider;

  validationInProgress: boolean;
  validationResponse: string;
  validationSuccess: boolean;

  constructor(private fulfillmentProviderService: FulfillmentProvidersService) { }

  ngOnInit() {
    this.fulfillmentProviderService.validationResponse$.subscribe(response => {
      this.validationInProgress = false;
      this.validationResponse = response.vendor_response ? response.vendor_response.message : 'Error!';
      this.validationSuccess = response.code === 'success';
    })
  }

  copyToClipboard(inputField): void {
    inputField.select();
    document.execCommand('copy');
  }

  validateProvider(): void {
    this.validationInProgress = true;

    this.fulfillmentProviderService.validateFulfillmentProvider(this.entity);
  }
}
