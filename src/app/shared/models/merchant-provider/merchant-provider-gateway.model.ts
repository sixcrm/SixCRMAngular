export enum MerchantProviderGatewayType {
  NMI,
  Innovio,
  Test,
  Stripe,
  AuthorizeNet,
  PaymentXP,
  Other
}

export class MerchantProviderGateway {
  rawType: string;
  type: MerchantProviderGatewayType;
  name: string;
  processorId: string;
  productId: string;
  username: string;
  password: string;
  apiKey: string;
  transactionKey: string;
  merchantId: string;
  merchantKey: string;
  processor: string;
  midnumber: string;
  descriptor: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.rawType = obj.type;
    this.setType(obj.type);
    this.name = obj.name || '';
    this.processorId = this.isNMI() ? obj.processor_id : '';
    this.productId = this.isInnovio() ? obj.product_id : '';
    this.username = obj.username || '';
    this.password = obj.password || '';
    this.apiKey = obj.api_key || '';
    this.transactionKey = obj.transaction_key || '';
    this.merchantId = obj.merchant_id || '';
    this.merchantKey = obj.merchant_key || '';
    this.processor = obj.processor || '';
    this.midnumber = obj.midnumber || '';
    this.descriptor = obj.descriptor || '';
  }

  isNMI() {
    return this.type === MerchantProviderGatewayType.NMI;
  }

  isInnovio() {
    return this.type === MerchantProviderGatewayType.Innovio;
  }

  isTest() {
    return this.type === MerchantProviderGatewayType.Test;
  }

  isStripe() {
    return this.type === MerchantProviderGatewayType.Stripe;
  }

  isAuthorizeNet() {
    return this.type === MerchantProviderGatewayType.AuthorizeNet;
  }

  isPaymentXP() {
    return this.type === MerchantProviderGatewayType.PaymentXP;
  }

  isTypeSelected() {
    return this.isTest() || this.isInnovio() || this.isNMI() || this.isStripe() || this.isAuthorizeNet() || this.isPaymentXP();
  }

  getType() {
    if (this.isNMI())
      return 'NMI';

    if (this.isInnovio())
      return 'Innovio';

    if (this.isTest())
      return 'Test';

    if (this.isStripe())
      return 'Stripe';

    if (this.isAuthorizeNet())
      return 'AuthorizeNet';

    if (this.isPaymentXP())
      return 'PaymentXP';

    return '';
  }

  setType(type: string) {
    if (type === 'NMI')
      this.type = MerchantProviderGatewayType.NMI;
    else if (type === 'Innovio')
      this.type = MerchantProviderGatewayType.Innovio;
    else if (type === 'Test')
      this.type = MerchantProviderGatewayType.Test;
    else if (type === 'Stripe')
      this.type = MerchantProviderGatewayType.Stripe;
    else if (type === 'AuthorizeNet')
      this.type = MerchantProviderGatewayType.AuthorizeNet;
    else if (type === 'PaymentXP')
      this.type = MerchantProviderGatewayType.PaymentXP;
    else
      this.type = MerchantProviderGatewayType.Other;
  }

  copy(): MerchantProviderGateway {
    return new MerchantProviderGateway(this.inverse());
  }

  inverse(): any {
    return {
      name: this.name,
      type: this.rawType,
      processor_id: this.processorId,
      product_id: this.productId,
      username: this.username,
      password: this.password,
      api_key: this.apiKey,
      transaction_key: this.transactionKey,
      merchant_id: this.merchantId,
      merchant_key: this.merchantKey,
      processor: this.processor,
      midnumber: this.midnumber,
      descriptor: this.descriptor
    }
  }
}
