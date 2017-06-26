import {Entity} from '../entity.interface';
import {MerchantProviderCustomerService} from './merchant-provider-customer-service.model';
import {MerchantProviderGateway} from './merchant-provider-gateway.model';
import {MerchantProviderProcessingConfig} from './merchant-provider-processing-config.model';
import {MerchantProviderProcessor} from './merchant-provider-processor.model';

export class MerchantProvider implements Entity<MerchantProvider>{
  id: string;
  name: string;
  enabled: boolean;
  allowPrepaid: boolean;
  acceptedPaymentMethods: string[];
  customerService: MerchantProviderCustomerService;
  gateway: MerchantProviderGateway;
  processing: MerchantProviderProcessingConfig;
  processor: MerchantProviderProcessor;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
    this.enabled = obj.enabled || false;
    this.allowPrepaid = obj.allow_prepaid || false;
    this.acceptedPaymentMethods = obj.accepted_payment_methods || '';
    this.customerService = new MerchantProviderCustomerService(obj.customer_service);
    this.gateway = new MerchantProviderGateway(obj.gateway);
    this.processing = new MerchantProviderProcessingConfig(obj.processing);
    this.processor = new MerchantProviderProcessor(obj.processor);
  }

  copy(): MerchantProvider {
    return new MerchantProvider(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name,
      enabled: this.enabled,
      allow_prepaid: this.allowPrepaid,
      accepted_payment_methods: this.acceptedPaymentMethods,
      customer_service: this.customerService.inverse(),
      gateway: this.gateway.inverse(),
      processing: this.processing.inverse(),
      processor: this.processor.inverse()
    }
  }
}
