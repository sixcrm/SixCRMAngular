export class MerchantProviderProcessingConfigCounts {
  daily: number;
  monthly: number;
  weekly: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.daily = obj.daily;
    this.monthly = obj.monthly;
    this.weekly = obj.weekly;
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
