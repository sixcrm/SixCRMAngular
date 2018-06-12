import {Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {CustomersService} from '../../shared/services/customers.service';
import {Customer} from '../../shared/models/customer.model';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {Campaign} from '../../shared/models/campaign.model';
import {ProductSchedule} from '../../shared/models/product-schedule.model';
import {Product} from '../../shared/models/product.model';
import {ProductsService} from '../../shared/services/products.service';
import {ProductScheduleService} from '../../shared/services/product-schedule.service';
import {firstIndexOf} from '../../shared/utils/array.utils';
import {Address} from '../../shared/models/address.model';
import {Currency} from '../../shared/utils/currency/currency';
import {CreditCard} from '../../shared/models/credit-card.model';
import {Subscription, Subject} from 'rxjs';
import {PaymentFormComponent} from '../../shared/components/payment-form/payment-form.component';
import {
  isValidState, isValidCountry, isValidAddress, isValidCity, isAllowedZip,
  isValidZip, isAllowedCurrency, isAllowedEmail
} from '../../shared/utils/form.utils';
import {getPhoneNumberMask} from '../../shared/utils/mask.utils';
import {HttpWrapperTransactionalService} from '../../shared/services/http-wrapper-transactional.service';
import {
  CheckoutBody, CheckoutAddress, CheckoutCustomer,
  CheckoutCreditCard
} from '../../shared/models/checkout-body.model';
import {NavigationService} from '../../navigation/navigation.service';
import {countryCode, stateCode, getCountries, getStates} from '../../shared/utils/address.utils';
import {CheckoutResponse} from '../../shared/models/checkout-response.model';
import {SnackbarService} from '../../shared/services/snackbar.service';
import {SearchService} from '../../shared/services/search.service';
import {CampaignsService} from '../../shared/services/campaigns.service';
import {Router} from '@angular/router';

@Component({
  selector: 'create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {
  @ViewChild('paymentForm') paymentForm: PaymentFormComponent;
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  selectedCustomer: Customer;
  customers: Customer[] = [];
  newCustomerMode: boolean;
  newCustomerInvalid: boolean;
  mask = getPhoneNumberMask();

  selectedCampaign: Campaign;
  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];
  campaignFilterValue: string;
  hasNoCampaigns: boolean;

  selectedProducts: (Product | ProductSchedule)[] = [];
  productFilterValue: string;
  products: (Product | ProductSchedule)[] = [];
  filteredProducts: (Product | ProductSchedule)[] = [];
  productInEdit: Product = new Product();

  shippingAddress: Address = new Address();
  selectedShippingAddress: Address;
  shippingAddressInvalid: boolean;

  shippings: Product[] = [];
  selectedShippings: Product[] = [];
  shippingFilterValue: string;
  filteredShippings: Product[] = [];

  step: number = 0;

  selectedCreditCard: CreditCard;
  newCreditCard: CreditCard = new CreditCard();

  newCardMode: boolean = true;

  customerSub: Subscription;
  customerSearchSub: Subscription;
  customerSearchDebouncer: Subject<string> = new Subject();

  selectedCcvError: boolean = false;
  showPreview: boolean;

  isZipValid = isValidZip;
  isAllowedZipKey = isAllowedZip;
  isCityValid = isValidCity;
  isAddressValid = isValidAddress;
  isCountryValid = isValidCountry;
  isStateValid = isValidState;
  isCurrencyValid = isAllowedCurrency;
  isAllowedEmailKey = isAllowedEmail;

  orderComplete: boolean;
  checkoutResponse: CheckoutResponse;

  countries: string[] = getCountries();
  states: string[] = getStates();

  plainMapper = (el) => el;

  constructor(
    private customerService: CustomersService,
    private productService: ProductsService,
    private productScheduleService: ProductScheduleService,
    private campaignService: CampaignsService,
    private transactionalAPI: HttpWrapperTransactionalService,
    private navigationService: NavigationService,
    private snackService: SnackbarService,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.customerSearchDebouncer.debounceTime(250).subscribe(value => {
      if (this.customerSearchSub) {
        this.customerSearchSub.unsubscribe();
      }

      this.customerSearchSub = this.searchService.searchCustomers(value).subscribe(customers => this.customers = customers);
    });

    this.campaignService.entities$.take(1).subscribe((campaigns) => {
      if (campaigns instanceof CustomServerError) return;

      this.campaigns = campaigns.filter(c => !c.allowOrderCreation);
      this.filteredCampaigns = this.campaigns.slice();

      const numberOfCampaigns = this.campaigns.length;

      if (numberOfCampaigns === 0) {
        this.hasNoCampaigns = true;
      }

      if (numberOfCampaigns === 1) {
        this.selectedCampaign = campaigns[0];
      }
    });

    this.productService.entities$.take(1).merge(this.productScheduleService.entities$.take(1)).subscribe(products => {
      if (products instanceof CustomServerError) return;

      this.products = [...this.products, ...products].sort((a,b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
    });

    this.productService.entities$.take(1).subscribe(shippings => {
      if (shippings instanceof CustomServerError) return;

      this.shippings = shippings;
    });

    this.campaignService.getEntities();
    this.productService.getEntities();
    this.productScheduleService.getEntities();
  }

  setStep(num: number) {
    this.step = num;
  }

  displayFn() {
    return '';
  }

  customerSelected(option) {
    this.selectedCustomer = option.option.value;

    if (this.customerSub) {
      this.customerSub.unsubscribe();
    }
    this.customerSub = this.customerService.entity$.take(1).subscribe(customer => {
      if (customer instanceof CustomServerError) return;

      this.selectedCustomer = customer;

      if (!this.selectedShippingAddress) {
        this.shippingAddress = this.selectedCustomer.address.copy();
      }

      if (this.selectedCustomer.creditCards[0]) {
        this.selectedCreditCard = this.selectedCustomer.creditCards[0].copy();
        this.newCardMode = false;
      }
    });
    this.customerService.getEntity(this.selectedCustomer.id);

    this.setStep(1);
  }

  customerInputChanged(event: any) {
    this.customerSearchDebouncer.next(event.srcElement.value);
  }

  newCustomer() {
    this.removeCustomer();
    this.newCustomerMode = true;
    this.newCustomerInvalid = false;
  }

  confirmNewCustomer() {
    this.newCustomerInvalid =
      !this.selectedCustomer.firstName
      || !this.selectedCustomer.lastName
      || !this.selectedCustomer.phone
      || !this.selectedCustomer.email;

    if (this.newCustomerInvalid) return;

    this.selectedCustomer.id = 'newid';
    this.setStep(1);
  }

  removeCustomer() {
    this.selectedCustomer = new Customer();
  }

  campaignSelected(option) {
    this.selectedCampaign = option.option.value;
    this.setStep(2);
  }

  campaignFilterFunction = (campaign: Campaign) => {
    if (!this.campaignFilterValue || !this.campaignFilterValue.toLowerCase) return true;

    const filter = this.campaignFilterValue.toLowerCase();

    return campaign.name.toLowerCase().indexOf(filter) !== -1;
  };

  campaignInputChanged() {
    this.filteredCampaigns = this.campaigns.filter(this.campaignFilterFunction);
  }

  removeCampaign() {
    this.selectedCampaign = new Campaign();
  }

  productSelected(option) {
    this.selectedProducts.push(option.option.value);
    this.productFilterValue = '';
  }

  productFilterFunction = (product: Product) => {
    if (!this.productFilterValue || !this.productFilterValue.toLowerCase) return true;

    const filter = this.productFilterValue.toLowerCase();

    return product.name.toLowerCase().indexOf(filter) !== -1;
  };

  productInputChanged(event?: any) {
    const pattern = /[0-9]|[a-z]|[A-Z]|@|-|\(|\)Backspace|ArrowUp|ArrowDown|ArrowRight|ArrowLeft|Tab/;

    if (event && event.key && !pattern.test(event.key)) {
      return;
    }

    this.filteredProducts = this.products.filter(this.productFilterFunction);
  }

  removeProduct(product: Product | ProductSchedule) {
    const index = firstIndexOf(this.selectedProducts, (el: Product | ProductSchedule) => el.id === product.id);

    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
    }

    this.productFilterValue = '';
  }

  confirmShippingAddress() {
    this.shippingAddressInvalid =
    !this.shippingAddress.line1 || !this.isAddressValid(this.shippingAddress.line1)
    || (this.shippingAddress.line2 && !this.isAddressValid(this.shippingAddress.line2))
    || !this.isCityValid(this.shippingAddress.city)
    || !this.isStateValid(this.shippingAddress.state)
    || !this.shippingAddress.zip || !this.isZipValid(this.shippingAddress.zip)
    || !this.isCountryValid(this.shippingAddress.country);

    if (this.shippingAddressInvalid) return;

    this.selectedShippingAddress = this.shippingAddress.copy();
    this.setStep(4);
  }

  removeShippingAddress() {
    this.selectedShippingAddress = null;

    if (this.selectedCustomer && this.selectedCustomer.id) {
      this.shippingAddress = this.selectedCustomer.address.copy();
    } else {
      this.shippingAddress = new Address();
    }
  }

  shippingSelected(option) {
    this.selectedShippings.push(option.option.value);
    this.shippingFilterValue = '';
  }

  shippingFilterFunction = (shipping: Product) => {
    if (!this.shippingFilterValue || !this.shippingFilterValue.toLowerCase) return true;

    const filter = this.shippingFilterValue.toLowerCase();

    return shipping.name.toLowerCase().indexOf(filter) !== -1;
  };

  shippingInputChanged(event?: any) {
    const pattern = /[0-9]|[a-z]|[A-Z]|@|-|\(|\)Backspace|ArrowUp|ArrowDown|ArrowRight|ArrowLeft|Tab/;

    if (event && event.key && !pattern.test(event.key)) {
      return;
    }

    this.filteredShippings = this.shippings.filter(this.shippingFilterFunction);
  }

  removeShipping(shipping: Product) {
    const index = firstIndexOf(this.selectedShippings, (el: Product) => el.id === shipping.id);

    if (index !== -1) {
      this.selectedShippings.splice(index, 1);
    }

    this.shippingFilterValue = '';
  }

  ccChanged(event) {
    this.selectedCreditCard = event.value.copy();

    this.newCardMode = false;
  }

  newCardSelected() {
    this.selectedCreditCard = undefined;
    this.newCardMode = true;
  }

  removeCreditCard() {
    this.selectedCreditCard = undefined;
  }

  quantityPlus(product: Product | ProductSchedule) {
    product.quantity++;
  }

  quantityMinus(product: Product | ProductSchedule) {
    if (product.quantity > 1) {
      product.quantity--;
    }
  }

  customerNextStep() {
    if (!this.selectedCustomer || !this.selectedCustomer.id) return;

    this.setStep(1)
  }

  campaignNextStep() {
    if (!this.selectedCampaign || !this.selectedCampaign.id) return;

    this.setStep(2)
  }

  productNextStep() {
    if (!this.selectedProducts || this.selectedProducts.length === 0) return;

    this.setStep(3);
  }

  shippingNextStep() {
    this.setStep(5);
  }

  billingNextStep() {
    if (!this.selectedCreditCard && this.newCardMode && this.paymentForm) {
      if (this.paymentForm.isValid()) {
        this.selectedCreditCard = this.newCreditCard.copy();
      } else {
        return;
      }
    }

    if (this.allSelectedValid()) {
      this.setStep(6);
      this.showPreview = true;
    }
  }

  allSelectedValid() {
    this.selectedCcvError = false;

    if (!this.selectedCustomer || !this.selectedCustomer.id) {
      this.setStep(0);

      return false;
    }

    if (!this.selectedCampaign || !this.selectedCampaign.id) {
      this.setStep(1);

      return false;
    }

    if (!this.selectedProducts || this.selectedProducts.length === 0) {
      this.setStep(2);

      return false;
    }

    if (!this.selectedShippingAddress) {
      this.setStep(3);

      return false;
    }

    if (!this.selectedCreditCard) {
      this.setStep(5);

      return false;
    }

    if (this.selectedCreditCard.ccv && this.ccvInvalid(this.selectedCreditCard)) {
      this.selectedCcvError = true;
      this.setStep(5);

      return false;
    }

    return true;
  }

  ccvInvalid(creditCard: CreditCard): boolean {
    if (!creditCard.ccv) return true;

    return !/[0-9]/.test(creditCard.ccv) || creditCard.ccv.length < 3 || creditCard.ccv.length > 4;
  }

  getPrice() {
    if (!this.selectedProducts) return new Currency(0);

    return new Currency(this.selectedProducts.map(p => {

      if (p instanceof ProductSchedule) {
        return (p.firstSchedulePrice.amount || 0) * p.quantity;
      }

      return (p.defaultPrice.amount || 0) * p.quantity;
    }).reduce((a,b) => a+b, 0));
  }

  getShipping() {
    if (!this.selectedShippings) return new Currency(0);

    return new Currency(this.selectedShippings.map(p => (p.defaultPrice.amount || 0) * p.quantity).reduce((a,b) => a+b, 0));
  }

  getTotal() {
    const p = this.getPrice();
    const s = this.getShipping();

    return new Currency(p.amount + s.amount);
  }

  isCurrencyInput(event) {
    if (!event) return;

    if (event.key === 'Enter') {
      this.setProductInEditPrice();
    }

    this.isCurrencyValid(event);
  }

  setProductInEdit(product: Product | ProductSchedule) {
    if (product instanceof ProductSchedule) {
      this.productInEdit = new Product();
      return;
    }

    this.productInEdit = product.copy();
  }

  setProductInEditPrice() {
    for (let i = 0; i < this.selectedProducts.length; i++) {
      if (this.selectedProducts[i].id === this.productInEdit.id) {
        let selected = this.selectedProducts[i];

        if (selected instanceof Product) {
          this.productInEdit['error'] = !selected.dynamicPrice || !selected.dynamicPrice.enabled || this.productInEdit.defaultPrice.amount < selected.dynamicPrice.min.amount || this.productInEdit.defaultPrice.amount > selected.dynamicPrice.max.amount;

          selected.defaultPrice = this.productInEdit.defaultPrice;
        }

        if (!this.productInEdit['error']) {
          this.productInEdit = new Product();
        }

        return;
      }
    }
  }

  processOrder() {
    const shippingAddress: CheckoutAddress = {
      line1: this.selectedShippingAddress.line1,
      city: this.selectedShippingAddress.city,
      state: stateCode(this.selectedShippingAddress.state),
      zip: this.selectedShippingAddress.zip,
      country: countryCode(this.selectedShippingAddress.country)
    };

    if (this.selectedShippingAddress.line2) {
      shippingAddress.line2 = this.selectedShippingAddress.line2;
    }

    const customer: CheckoutCustomer = {
      firstname: this.selectedCustomer.firstName,
      lastname: this.selectedCustomer.lastName,
      email: this.selectedCustomer.email,
      phone: this.selectedCustomer.phone,
      address: shippingAddress
    };

    const billingAddress: CheckoutAddress = {
      line1: this.selectedCreditCard.address.line1,
      city: this.selectedCreditCard.address.city,
      state: stateCode(this.selectedCreditCard.address.state),
      zip: this.selectedCreditCard.address.zip,
      country: countryCode(this.selectedCreditCard.address.country)
    };

    if (this.selectedCreditCard.address.line2) {
      billingAddress.line2 = this.selectedCreditCard.address.line2;
    }

    const creditCard: CheckoutCreditCard = {
      name: this.selectedCreditCard.name,
      number: this.selectedCreditCard.ccnumber,
      expiration: this.selectedCreditCard.expiration,
      address: billingAddress
    };

    if (this.selectedCreditCard.ccv) {
      creditCard.ccv = this.selectedCreditCard.ccv;
    }

    let products = [];
    let productSchedules = [];

    this.selectedProducts.forEach(p => {
      if (p instanceof Product) {
        products.push({quantity: p.quantity || 1, price: p.defaultPrice.amount || 0, product: p.id});
      }

      if (p instanceof ProductSchedule) {
        productSchedules.push({quantity: p.quantity || 1, product_schedule: p.id});
      }
    });

    if (this.shippings && this.shippings.length > 0) {
      products = [...products,...this.selectedShippings.map(s => s.id)];
    }

    const checkoutBody: CheckoutBody = {
      campaign: this.selectedCampaign.id,
      customer: customer,
      creditcard: creditCard
    };

    if (products && products.length > 0) {
      checkoutBody.products = products;
    }

    if (productSchedules && productSchedules.length > 0) {
      checkoutBody.product_schedules = productSchedules;
    }

    this.navigationService.setShowProcessingOrderOverlay(true);

    this.transactionalAPI.checkout(checkoutBody).subscribe(response => {
      this.navigationService.setShowProcessingOrderOverlay(false);

      if (response instanceof CheckoutResponse) {
        this.orderComplete = true;
        this.checkoutResponse = response;
      } else {
        this.snackService.showErrorSnack(response.message, 6000);
      }
    })
  }
}
