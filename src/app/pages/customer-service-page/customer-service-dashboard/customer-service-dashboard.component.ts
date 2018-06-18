import { Component, OnInit } from '@angular/core';
import {Customer} from '../../../shared/models/customer.model';
import {Subject, Subscription} from 'rxjs';
import {SearchService} from '../../../shared/services/search.service';
import {Router} from '@angular/router';
import {Session} from '../../../shared/models/session.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import { routerTransition } from '../../../routing.animations';
import {FeatureFlagService} from '../../../shared/services/feature-flag.service';

@Component({
  selector: 'customer-service-dashboard',
  templateUrl: './customer-service-dashboard.component.html',
  styleUrls: ['./customer-service-dashboard.component.scss'],
  animations: [routerTransition(true)]
})
export class CustomerServiceDashboardComponent implements OnInit {

  public transition: 'void' | '*' = '*';

  customers: Customer[] = [];
  sessions: Session[] = [];

  customerDebouncer: Subject<string> = new Subject();
  customerSub: Subscription;

  sessionDebouncer: Subject<string> = new Subject();
  sessionSub: Subscription;
  preventSearch: boolean;

  customersInputValue: string;
  sessionsInputValue: string;

  constructor(
    public authService: AuthenticationService,
    private searchService: SearchService,
    private router: Router,
    private featuresFlagService: FeatureFlagService
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

  customersFocused() {
    if (this.customersInputValue) {
      this.customerDebouncer.next(this.customersInputValue);
    }
  }

  customersBlurred() {
    setTimeout(() => {
      if (this.customerSub) {
        this.customerSub.unsubscribe();
      }

      this.customers = []
    }, 150);
  }

  sessionFocused() {
    if (this.sessionsInputValue) {
      this.sessionDebouncer.next(this.sessionsInputValue);
    }
  }

  sessionBlurred() {
    setTimeout(() => {
      if (this.sessionSub) {
        this.sessionSub.unsubscribe();
      }

      this.sessions = []
    }, 150);
  }

  customerInputChanged() {
    this.customerDebouncer.next(this.customersInputValue);
  }

  sessionInputChanged() {
    this.sessionDebouncer.next(this.sessionsInputValue);
  }

  customerSearchKeyDown(event) {
    setTimeout(() => {
      if (event.key === 'Enter' && !this.preventSearch) {
        this.router.navigate(['/search'], {queryParams: {query: this.customersInputValue, filters: 'customer'}})
      }
    }, 150);
  }

  sessionSearchKeyDown(event) {
    setTimeout(() => {
      if (event.key === 'Enter' && !this.preventSearch) {
        this.router.navigate(['/search'], {queryParams: {query: this.sessionsInputValue, filters: 'session'}})
      }
    }, 150);

  }

  selected(event: Customer | Session) {

    if (event instanceof Customer) {
      this.preventSearch = true;

      if (this.featuresFlagService.isEnabled('advanced-session-model')) {
        this.router.navigate(['/customer-advanced', event.id]);
      } else {
        this.router.navigate(['/customer-service', 'pair'], {queryParams: {customer: event.id}})
      }
    }

    if (event instanceof Session) {
      this.preventSearch = true;

      if (this.featuresFlagService.isEnabled('advanced-session-model')) {
        this.router.navigate(['/customer-advanced', 'session', event.id]);
      } else {
        this.router.navigate(['/customer-service', 'pair'], {queryParams: {session: event.id}})
      }
    }

  }
}
