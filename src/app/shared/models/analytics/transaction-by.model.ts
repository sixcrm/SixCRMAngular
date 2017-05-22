import {Currency} from '../../utils/currency/currency';

export class TransactionByFacets {
  facet: string;
  count: number;
  countPercentage: number;
  amount: Currency;
  amountPercentage: number;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.facet = obj.facet || '';
    this.count = obj.count || 0;
    this.countPercentage = obj.count_percentage.replace('%', '') || 0;
    this.amount = new Currency(obj.amount);
    this.amountPercentage = obj.amount_percentage.replace('%', '') || 0;
  }
}

export class TransactionsBy {
  count: number;
  facetType: string;
  facets: TransactionByFacets[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.count = obj.count || 0;
    this.facetType = obj.facet_type || '';

    if (obj.facets) {
      obj.facets.forEach(facet => this.facets.push(new TransactionByFacets(facet)));
    }
  }
}
