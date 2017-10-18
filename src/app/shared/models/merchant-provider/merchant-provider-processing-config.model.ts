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

    this.discountRate = obj.discount_rate;
    this.maximumChargebackRatio = obj.maximum_chargeback_ratio;
    this.reserveRate = obj.reserve_rate;
    this.monthlyCap = obj.monthly_cap;
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
      reserve_rate: this.reserveRate,
      monthly_cap: this.monthlyCap,
      transaction_counts: this.transactionCounts.inverse(),
      transaction_fee: this.transactionFee
    }
  }
}
