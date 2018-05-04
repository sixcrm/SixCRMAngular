import { Component, OnInit } from '@angular/core';
import {NavigationService} from '../../../navigation/navigation.service';
import {Customer} from '../../../shared/models/customer.model';
import {Subject, Subscription} from 'rxjs';
import {SearchService} from '../../../shared/services/search.service';
import {Router} from '@angular/router';
import {Session} from '../../../shared/models/session.model';
import {AuthenticationService} from '../../../authentication/authentication.service';

@Component({
  selector: 'customer-service-dashboard',
  templateUrl: './customer-service-dashboard.component.html',
  styleUrls: ['./customer-service-dashboard.component.scss']
})
export class CustomerServiceDashboardComponent implements OnInit {

  focusedItem: number = 0;

  customers: Customer[] = [];
  sessions: Session[] = [];

  customerDebouncer: Subject<string> = new Subject();
  customerSub: Subscription;

  sessionDebouncer: Subject<string> = new Subject();
  sessionSub: Subscription;
  preventSearch: boolean;

  constructor(
    public navigationService: NavigationService,
    public authService: AuthenticationService,
    private searchService: SearchService,
    private router: Router
  ) { }

  ngOnInit() {
    this.customerDebouncer.debounceTime(250).subscribe(value => {
      if (this.customerSub) {
        this.customerSub.unsubscribe();
      }

      this.customerSub = this.searchService.searchCustomers(value).subscribe(customers => this.customers = customers);
    });

    this.sessionDebouncer.debounceTime(250).subscribe(value => {
      if (this.sessionSub) {
        this.sessionSub.unsubscribe();
      }

      this.sessionSub = this.searchService.searchSessions(value).subscribe(sessions => this.sessions = sessions);
    })
  }

  customerInputChanged(event) {
    this.customerDebouncer.next(event.srcElement.value);
  }

  sessionInputChanged(event) {
    this.sessionDebouncer.next(event.srcElement.value);
  }

  setFocus(val: number, element?: any) {
    if (this.focusedItem === val) return;

    if (element && element.focus) {
      element.value = '';
      element.focus();
    }

    this.focusedItem = val;
  }

  openCreateOrder() {
    this.focusedItem = 2;
    this.navigationService.setShowCreateNewOrderModal(true)
  }

  navigateToCustomer(event) {
    this.preventSearch = true;
    this.router.navigate(['/customer-service', 'pair'], {queryParams: {customer: event.option.value}})
  }

  navigateToSession(event) {
    this.preventSearch = true;
    this.router.navigate(['/customer-service', 'pair'], {queryParams: {session: event.option.value}})
  }

  searchKeyDown(event, input, filter) {
    if (event.key === 'Enter' && !this.preventSearch) {
      this.router.navigate(['/search'], {queryParams: {query: input.value, filters: filter}})
    } else {
      this.preventSearch = false;
    }
  }
}
