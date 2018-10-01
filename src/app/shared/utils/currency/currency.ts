const numeral = require('numeral');

export class Currency {

  amount: number;

  constructor(amount: number) {
    if (!amount) {
      amount = 0;
    }

    this.amount = +amount;
  }

  usd(): string {
    return numeral(this.amount).format('$0,0.00');
  }

  parsedAmount(): string {
    return numeral(this.amount).format('0,0.00');
  }

  isMoreThan(other: Currency): boolean {
    if (!other) return true;

    return this.amount > other.amount;
  }

  isMoreOrEqualThan(other: Currency): boolean {
    if (!other) return true;

    return this.amount >= other.amount;
  }

  isEqualTo(other: Currency): boolean {
    if (!other) return false;

    return this.amount === other.amount;
  }

  isLessThan(other: Currency): boolean {
    if (!other) return false;

    return this.amount < other.amount;
  }

  isLessOrEqualThan(other: Currency): boolean {
    if (!other) return false;

    return this.amount <= other.amount;
  }
}
