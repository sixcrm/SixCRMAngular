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

      this.products = products;
    });

    this.customerService.getEntities();
    this.campaignService.getEntities();
    this.productService.getEntities();
    this.productScheduleService.getEntities();
  }

  displayFn() {
    return '';
  }

  customerSelected(option) {
    this.selectedCustomer = option.option.value;
    this.customerFilterValue = '';
  }

  customerFilterFunction = (customer: Customer) => {
    if (!this.customerFilterValue || !this.customerFilterValue.toLowerCase) return true;

    const filter = this.customerFilterValue.toLowerCase();

    return `${customer.firstName.toLowerCase()} ${customer.lastName.toLowerCase()} ${customer.phone.toLowerCase()} ${customer.email.toLowerCase()}`.indexOf(filter) !== -1;
  };

  customerInputChanged(event) {
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

  removeCustomer() {
    this.selectedCustomer = new Customer();
    this.customerFilterValue = '';
  }

  campaignSelected(option) {
    this.selectedCampaign = option.option.value;
    this.campaignFilterValue = '';
  }

  campaignFilterFunction = (campaign: Campaign) => {
    if (!this.campaignFilterValue || !this.campaignFilterValue.toLowerCase) return true;

    const filter = this.campaignFilterValue.toLowerCase();

    return campaign.name.toLowerCase().indexOf(filter) !== -1;
  };

  campaignInputChanged(event) {
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

  productInputChanged(event) {
    const pattern = /[0-9]|[a-z]|[A-Z]|@|-|\(|\)Backspace|ArrowUp|ArrowDown|ArrowRight|ArrowLeft|Tab/;

    if (event && event.key && !pattern.test(event.key)) {
      return;
    }

    this.filteredProducts = this.products.filter(this.productFilterFunction);
  }

  removeProduct(product) {
    const index = firstIndexOf(this.selectedProducts, (el: Product | ProductSchedule) => el.id === product.id);

    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
    }

    this.productFilterValue = '';
  }
}
