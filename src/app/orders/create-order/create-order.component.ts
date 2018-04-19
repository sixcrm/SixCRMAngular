import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {CustomersService} from '../../shared/services/customers.service';
import {Customer} from '../../shared/models/customer.model';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {Campaign} from '../../shared/models/campaign.model';
import {CampaignsService} from '../../shared/services/campaigns.service';
import {ProductSchedule} from '../../shared/models/product-schedule.model';
import {Product} from '../../shared/models/product.model';
import {ProductsService} from '../../shared/services/products.service';
import {ProductScheduleService} from '../../shared/services/product-schedule.service';
import {firstIndexOf} from '../../shared/utils/array.utils';
import {Address} from '../../shared/models/address.model';
import {Currency} from '../../shared/utils/currency/currency';
import {CreditCard} from '../../shared/models/credit-card.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  selectedCustomer: Customer;
  customerFilterValue: string;
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  newCustomerMode: boolean;

  selectedCampaign: Campaign;
  campaignFilterValue: string;
  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];

  selectedProducts: (Product | ProductSchedule)[] = [];
  productFilterValue: string;
  products: (Product | ProductSchedule)[] = [];
  filteredProducts: (Product | ProductSchedule)[] = [];

  shippingAddress: Address = new Address();
  selectedShippingAddress: Address;

  shippings: Product[] = [];
  selectedShippings: Product[] = [];
  shippingFilterValue: string;
  filteredShippings: Product[] = [];

  step: number = 0;

  selectedCreditCard: CreditCard;
  newCreditCard: CreditCard = new CreditCard();

  newCardMode: boolean = true;

  customerSub: Subscription;

  constructor(
    private customerService: CustomersService,
    private campaignService: CampaignsService,
    private productService: ProductsService,
    private productScheduleService: ProductScheduleService
  ) { }

  ngOnInit() {
    this.customerService.entities$.take(1).subscribe(customers => {
      if (customers instanceof CustomServerError) return;

      this.customers = customers;
    });

    this.campaignService.entities$.take(1).subscribe(campaigns => {
      if (campaigns instanceof CustomServerError) return;

      this.campaigns = campaigns;
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

    this.customerService.getEntities();
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
    this.shippingAddress = this.selectedCustomer.address.copy();

    if (this.customerSub) {
      this.customerSub.unsubscribe();
    }
    this.customerSub = this.customerService.entity$.take(1).subscribe(customer => {
      if (customer instanceof CustomServerError) return;

      this.selectedCustomer = customer;
    });
    this.customerService.getEntity(this.selectedCustomer.id);

    this.customerFilterValue = '';
    this.setStep(1);
  }

  customerFilterFunction = (customer: Customer) => {
    if (!this.customerFilterValue || !this.customerFilterValue.toLowerCase) return true;

    const filter = this.customerFilterValue.toLowerCase();

    return `${customer.firstName.toLowerCase()} ${customer.lastName.toLowerCase()} ${customer.phone.toLowerCase()} ${customer.email.toLowerCase()}`.indexOf(filter) !== -1;
  };

  customerInputChanged(event?: any) {
    const pattern = /[0-9]|[a-z]|[A-Z]|@|-|\(|\)Backspace|ArrowUp|ArrowDown|ArrowRight|ArrowLeft|Tab/;

    if (event && event.key && !pattern.test(event.key)) {
      return;
    }

    this.filteredCustomers = this.customers.filter(this.customerFilterFunction);
  }

  newCustomer() {
    this.removeCustomer();
    this.newCustomerMode = true;
  }

  confirmNewCustomer(valid: boolean) {
    if (!valid) return;

    this.selectedCustomer.id = 'newid';
    this.setStep(1);
  }

  removeCustomer() {
    this.selectedCustomer = new Customer();
    this.customerFilterValue = '';
  }

  campaignSelected(option) {
    this.selectedCampaign = option.option.value;
    this.campaignFilterValue = '';
    this.setStep(2);
  }

  campaignFilterFunction = (campaign: Campaign) => {
    if (!this.campaignFilterValue || !this.campaignFilterValue.toLowerCase) return true;

    const filter = this.campaignFilterValue.toLowerCase();

    return campaign.name.toLowerCase().indexOf(filter) !== -1;
  };

  campaignInputChanged(event?: any) {
    const pattern = /[0-9]|[a-z]|[A-Z]|@|-|\(|\)Backspace|ArrowUp|ArrowDown|ArrowRight|ArrowLeft|Tab/;

    if (event && event.key && !pattern.test(event.key)) {
      return;
    }

    this.filteredCampaigns = this.campaigns.filter(this.campaignFilterFunction);
  }

  removeCampaign() {
    this.selectedCampaign = new Campaign();
    this.campaignFilterValue = '';
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

  confirmShippingAddress(valid: boolean) {
    if (!valid) return;

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
    this.selectedCreditCard = event.value;
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
    if (!this.selectedCustomer.id) return;

    this.setStep(1)
  }

  campaignNextStep() {
    if (!this.selectedCampaign.id) return;

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

  }

  getPrice() {
    if (!this.selectedProducts) return new Currency(0);

    return new Currency(this.selectedProducts.map(p => {

      if (p instanceof ProductSchedule) {
        return p.schedules.map(s => s.price.amount).reduce((a,b) => a+b,0) * p.quantity;
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
}
