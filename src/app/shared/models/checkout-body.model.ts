export interface CheckoutCustomer {
  firstname: string,
  lastname: string,
  email: string,
  phone?: string;
  address?: CheckoutAddress
}

export interface CheckoutProductSchedule {
  quantity: number,
  product_schedule: string
}

export interface CheckoutProduct {
  quantity: number,
  amount: number;
  product: string
}

export interface CheckoutCreditCard {
  name: string,
  number: string,
  expiration: string,
  cvv?: string,
  address?: CheckoutAddress
}

export interface CheckoutAddress {
  line1: string,
  line2?: string,
  city: string,
  state: string,
  zip: string,
  country: string
}

export interface CheckoutBody {
  campaign: string,
  customer: CheckoutCustomer,
  creditcard: CheckoutCreditCard,
  products?: CheckoutProduct[],
  product_schedules?: CheckoutProductSchedule[]
}
