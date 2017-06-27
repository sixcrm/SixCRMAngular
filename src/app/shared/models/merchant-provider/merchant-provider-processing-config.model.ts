import {MerchantProviderProcessingConfigCounts} from './merchant-provider-processing-config-counts.model';

export class MerchantProviderProcessingConfig {
  discountRate: number;
  maximumChargebackRatio: number;
  monthlyCap: number;
  reserveRate: number;
  transactionCounts: MerchantProviderProcessingConfigCounts;
  transactionFee: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.discountRate = obj.discount_rate;
    this.maximumChargebackRatio = obj.maximum_chargeback_ratio;
    this.monthlyCap = obj.monthly_cap;
    this.reserveRate = obj.reserve_rate;
    this.transactionCounts = new MerchantProviderProcessingConfigCounts(obj.transaction_counts);
    this.transactionFee = obj.transaction_fee;
  }

  copy(): MerchantProviderProcessingConfig {
    return new MerchantProviderProcessingConfig(this.inverse());
  }

  inverse(): any {
    return {
      discount_rate: this.discountRate,
      maximum_chargeback_ratio: this.maximumChargebackRatio,
      monthly_cap: this.monthlyCap,
      reserve_rate: this.reserveRate,
      transaction_counts: this.transactionCounts.inverse(),
      transaction_fee: this.transactionFee
    }
  }
}
