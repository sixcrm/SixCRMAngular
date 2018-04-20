export interface CheckoutCustomer {
  first_name: string,
  last_name: string,
  email: string,
  phone: string;
  address: CheckoutAddress
}

export interface CheckoutProductSchedule {
  id: string
}

export interface CheckoutProduct {
  id: string;
}

export interface CheckoutCreditCard {
  name: string,
  number: string,
  expiration: string,
  ccv: string,
  address: CheckoutAddress
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
  customer?: CheckoutCustomer,
  creditcard?: CheckoutCreditCard,
  products?: CheckoutProduct[],
  product_schedules?: CheckoutProductSchedule[]
}
