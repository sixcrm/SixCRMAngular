import {MerchantProviderProcessingConfigCounts} from './merchant-provider-processing-config-counts.model';

export class MerchantProviderProcessingConfig {
  discountRate: number;
  maximumChargebackRatio: number;
  reserveRate: number;
  monthlyCap: string;
  transactionCounts: MerchantProviderProcessingConfigCounts;
  transactionFee: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.discountRate = obj.discount_rate ? obj.discount_rate * 100 : undefined;
    this.maximumChargebackRatio = obj.maximum_chargeback_ratio ? obj.maximum_chargeback_ratio * 100 : undefined;
    this.reserveRate = obj.reserve_rate ? obj.reserve_rate * 100 : undefined;
    this.monthlyCap = obj.monthly_cap;
    this.transactionCounts = new MerchantProviderProcessingConfigCounts(obj.transaction_counts);
    this.transactionFee = obj.transaction_fee;
  }

  copy(): MerchantProviderProcessingConfig {
    return new MerchantProviderProcessingConfig(this.inverse());
  }

  inverse(): any {
    return {
      discount_rate: this.discountRate === 0 ? 0 : (this.discountRate ? this.discountRate / 100 : 0),
      maximum_chargeback_ratio: this.maximumChargebackRatio === 0 ? 0 : (this.maximumChargebackRatio ? this.maximumChargebackRatio / 100 : 0),
      reserve_rate: this.reserveRate === 0 ? 0 : (this.reserveRate ? this.reserveRate / 100 : 0),
      monthly_cap: this.monthlyCap,
      transaction_counts: this.transactionCounts.inverse(),
      transaction_fee: this.transactionFee
    }
  }
}
