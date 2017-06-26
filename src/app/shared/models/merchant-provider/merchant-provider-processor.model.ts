export class MerchantProviderProcessor {
  id: string;
  name: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.id = obj.id || '';
    this.name = obj.name || '';
  }

  copy(): MerchantProviderProcessor {
    return new MerchantProviderProcessor(this.inverse());
  }

  inverse(): any {
    return {
      id: this.id,
      name: this.name
    }
  }
}
