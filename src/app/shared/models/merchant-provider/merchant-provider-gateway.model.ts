export enum MerchantProviderGatewayType {
  NMI,
  Innovio,
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
  }

  isNMI() {
    return this.type === MerchantProviderGatewayType.NMI;
  }

  isInnovio() {
    return this.type === MerchantProviderGatewayType.Innovio;
  }

  getType() {
    if (this.isNMI())
      return 'NMI';

    if (this.isInnovio())
      return 'Innovio';

    return '';
  }

  setType(type: string) {
    if (type === 'NMI')
      this.type = MerchantProviderGatewayType.NMI;
    else if (type === 'Innovio')
      this.type = MerchantProviderGatewayType.Innovio;
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
    }
  }
}
