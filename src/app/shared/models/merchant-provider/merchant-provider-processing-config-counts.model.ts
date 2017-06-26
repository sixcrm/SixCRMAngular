export class MerchantProviderProcessingConfigCounts {
  daily: number;
  monthly: number;
  weekly: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.daily = obj.daily || 0;
    this.monthly = obj.monthly || 0;
    this.weekly = obj.weekly || 0;
  }

  copy(): MerchantProviderProcessingConfigCounts {
    return new MerchantProviderProcessingConfigCounts(this.inverse());
  }

  inverse(): any {
    return {
      daily: this.daily,
      monthly: this.monthly,
      weekly: this.weekly
    }
  }
}
