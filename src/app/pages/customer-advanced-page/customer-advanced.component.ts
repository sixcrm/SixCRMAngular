import {Component, OnInit, ViewChild} from '@angular/core';
import {Customer} from '../../shared/models/customer.model';
import {AbstractEntityViewComponent} from '../abstract-entity-view.component';
import {CustomersService} from '../../entity-services/services/customers.service';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../navigation/navigation.service';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {TabHeaderElement} from '../../shared/components/tab-header/tab-header.component';
import {CustomerInfoNotesComponent} from './customer-info-notes/customer-info-notes.component';

@Component({
  selector: 'customer-advanced',
  templateUrl: './customer-advanced.component.html',
  styleUrls: ['./customer-advanced.component.scss']
})
export class CustomerAdvancedComponent  extends AbstractEntityViewComponent<Customer> implements OnInit {

  path = ['Home', 'Customers'];

  tabHeaders: TabHeaderElement[] = [
    {name: 'subscriptions', label: 'SUBSCRIPTIONS'},
    {name: 'orders', label: 'ORDERS'},
    {name: 'transactions', label: 'TRANSACTIONS'},
    {name: 'fulfillment', label: 'FULFILLMENT'},
    {name: 'activity', label: 'ACTIVITY'}
  ];

  secondaryTabHeaders: TabHeaderElement[] = [
    {name: 'info', label: 'INFO'},
    {name: 'notes', label: 'NOTES'}
  ];

  selectedIndex: number = 0;
  selectedSecondaryIndex: number = 0;

  @ViewChild('customernotes') customerNotesComponent: CustomerInfoNotesComponent;

  infoVisible: boolean = true;

  constructor(
    service: CustomersService,
    route: ActivatedRoute,
    public navigation: NavigationService
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.service.entity$.take(1).subscribe(customer => {
      if (customer instanceof CustomServerError) return;

      this.path = [...this.path, `${customer.firstName} ${customer.lastName}`]
    });

    this.init(() => this.navigation.goToNotFoundPage());
  }

  setIndex(index: number) {
    this.selectedIndex = index;
  }

  setSecondaryIndex(index: number) {
    this.selectedSecondaryIndex = index;

    if (index === 1) {
      this.customerNotesComponent.scrollToBottom();
    }
  }

}
