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
}
