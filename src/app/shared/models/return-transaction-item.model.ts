import { utc, Moment } from 'moment';

export class ReturnTransactionProductItem {
  alias: string;
  product: string;
  quantity: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.alias = obj.alias || '';
    this.product = obj.product || '';
    this.quantity = obj.quantity || 0;
  }

  copy(): ReturnTransactionProductItem {
    return new ReturnTransactionProductItem(this.inverse());
  }

  inverse(): any {
    return {
      alias: this.alias,
      product: this.product,
      quantity: this.quantity
    }
  }
}

export class ReturnTransactionItem {
  transaction: string;
  products: ReturnTransactionProductItem[] = [];
  createdAt: Moment;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.transaction = obj.transaction || '';

    if (obj.products) {
      this.products = obj.products.map(p => new ReturnTransactionProductItem(p));
    }

    this.createdAt = utc(obj.created_at);
  }

  copy(): ReturnTransactionItem {
    return new ReturnTransactionItem(this.inverse())
  }

  inverse(): any {
    return {
      transaction: this.transaction,
      products: this.products.map(p => p.inverse),
      created_at: this.createdAt.format()
    }
  }
}
