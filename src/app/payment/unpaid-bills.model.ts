import {Bill} from "../shared/models/bill.model";
import {Currency} from "../shared/utils/currency/currency";

export class UnpaidBills  {

  constructor(public bills: Bill[]) {
    this.bills = bills.filter(bill => !bill.paid);
  }

  static ofBills(bills: Bill[]): UnpaidBills {
    return new UnpaidBills(bills);
  }

  public total(): Currency {
    let total: number = 0;

    this.bills.forEach(bill => {
      total += bill.endingBalance.amount;
    });

    return new Currency(total);
  }
}
