import {Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {CustomersService} from '../../entity-services/services/customers.service';
import {Customer} from '../../shared/models/customer.model';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {Campaign} from '../../shared/models/campaign.model';
import {ProductSchedule} from '../../shared/models/product-schedule.model';
import {Product} from '../../shared/models/product.model';
import {ProductsService} from '../../entity-services/services/products.service';
import {ProductScheduleService} from '../../entity-services/services/product-schedule.service';
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
    CheckoutCreditCard, CheckoutProduct, CheckoutProductSchedule
} from '../../shared/models/checkout-body.model';
import {NavigationService} from '../../navigation/navigation.service';
import {countryCode, stateCode, getCountries, getStates} from '../../shared/utils/address.utils';
import {CheckoutResponse} from '../../shared/models/checkout-response.model';
import {SnackbarService} from '../../shared/services/snackbar.service';
import {SearchService} from '../../shared/services/search.service';
import {CampaignsService} from '../../entity-services/services/campaigns.service';
import {AccessKey} from '../../shared/models/access-key.model';
import {AccessKeysService} from '../../entity-services/services/access-keys.service';
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

  customerSub: Subscription;
  customerSearchSub: Subscription;
  customerSearchDebouncer: Subject<string> = new Subject();

  selectedCvvError: boolean = false;
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

  keys: AccessKey;
  noKeysFound: boolean;

  constructor(
    private customerService: CustomersService,
    private productService: ProductsService,
    private productScheduleService: ProductScheduleService,
    private campaignService: CampaignsService,
    private transactionalAPI: HttpWrapperTransactionalService,
    private navigationService: NavigationService,
    private snackService: SnackbarService,
    private searchService: SearchService,
    private router: Router,
    public keysService: AccessKeysService
  ) { }

  ngOnInit() {
    this.customerSearchDebouncer.debounceTime(250).subscribe(value => {
      if (this.customerSearchSub) {
        this.customerSearchSub.unsubscribe();
      }

      this.customerSearchSub = this.searchService.searchCustomers(value).subscribe(customers => this.customers = customers);
    });

    this.keysService.entities$.take(1).subscribe((keys) => {
      if (keys instanceof CustomServerError || !keys || keys.length === 0) {
        this.noKeysFound = true;
        return;
      }

      this.keys = keys[0];
    });

    this.campaignService.entities$.take(1).subscribe((campaigns) => {
      if (campaigns instanceof CustomServerError) return;

      this.campaigns = campaigns.filter((c: Campaign) => c.allowOnOrder);
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

    this.keysService.getEntities(10, null, {ignorePermissions: true});
    this.campaignService.getEntities(null, null, {ignorePermissions: true});
    this.productService.getEntities(null, null, {ignorePermissions: true});
    this.productScheduleService.getEntities(null, null, {ignorePermissions: true});
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
    if (this.paymentForm) {
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
    this.selectedCvvError = false;

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

    if (this.selectedCreditCard.cvv && this.cvvInvalid(this.selectedCreditCard)) {
      this.selectedCvvError = true;
      this.setStep(5);

      return false;
    }

    return true;
  }

  cvvInvalid(creditCard: CreditCard): boolean {
    if (!creditCard.cvv) return true;

    return !/[0-9]/.test(creditCard.cvv) || creditCard.cvv.length < 3 || creditCard.cvv.length > 4;
  }

  getPrice() {
    if (!this.selectedProducts) return new Currency(0);

    return new Currency(this.selectedProducts.map(p => {

      if (p instanceof ProductSchedule) {
        return (p.initialCycleSchedulesPrice.amount || 0) * p.quantity;
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
    if (!this.keys || !this.keys.secretKey || !this.keys.accessKey) return;

    const checkoutBody: CheckoutBody = this.parseCheckoutBody();

    this.navigationService.setShowProcessingOrderOverlay(true);

    this.transactionalAPI.checkout(checkoutBody, this.keys).subscribe(response => {
      this.navigationService.setShowProcessingOrderOverlay(false);

      if (response instanceof CheckoutResponse) {

        if (response.success) {
          this.orderComplete = true;
          this.checkoutResponse = response;
        } else {
          this.snackService.showErrorSnack('Error occurred while processing the order', 6000);
        }

      } else {
        this.snackService.showErrorSnack(response.message, 6000);
      }
    })
  }

  private parseCheckoutBody(): CheckoutBody {
    const customer = this.parseCustomer();
    const creditCard = this.parseCreditCard();
    const allProducts = this.parseProducts();

    const checkoutBody: CheckoutBody = {
      campaign: this.selectedCampaign.id,
      customer: customer,
      creditcard: creditCard
    };

    if (allProducts.products && allProducts.products.length > 0) {
      checkoutBody.products = allProducts.products;
    }

    if (allProducts.productSchedules && allProducts.productSchedules.length > 0) {
      checkoutBody.product_schedules = allProducts.productSchedules;
    }

    return checkoutBody;
  }

  private parseCreditCard() {
    const billingAddress: CheckoutAddress =  {
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

    if (this.selectedCreditCard.cvv) {
      creditCard.cvv = this.selectedCreditCard.cvv;
    }
    return creditCard;
  }

  private parseCustomer(): CheckoutCustomer {
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

    return {
      firstname: this.selectedCustomer.firstName,
      lastname: this.selectedCustomer.lastName,
      email: this.selectedCustomer.email,
      phone: this.selectedCustomer.phone,
      address: shippingAddress
    };
  }

  private parseProducts(): {products: CheckoutProduct[], productSchedules: CheckoutProductSchedule[]} {
    let products: CheckoutProduct[] = [];
    let productSchedules: CheckoutProductSchedule[] = [];

    this.selectedProducts.forEach(p => {
      if (p instanceof Product) {
        products.push({quantity: p.quantity || 1, price: p.defaultPrice.amount || 0, product: p.id});
      }

      if (p instanceof ProductSchedule) {
        productSchedules.push({quantity: p.quantity || 1, product_schedule: p.id});
      }
    });

    if (this.selectedShippings) {
      products = [...products, ...this.selectedShippings.map(sp => {
        return {quantity: sp.quantity || 1, price: sp.defaultPrice.amount || 0, product: sp.id}
      })];
    }

    return {products: products, productSchedules: productSchedules}
  }

  navigateToApiKeys() {
    this.router.navigate(['/accountmanagement', 'apikeys']);
    this.close.emit(true);
  }
}
