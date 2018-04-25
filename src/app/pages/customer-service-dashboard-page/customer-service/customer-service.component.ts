import { Component, OnInit } from '@angular/core';
import {NavigationService} from '../../../navigation/navigation.service';
import {Customer} from '../../../shared/models/customer.model';
import {Subject, Subscription} from 'rxjs';
import {SearchService} from '../../../shared/services/search.service';
import {Router} from '@angular/router';
import {Session} from '../../../shared/models/session.model';
import {AuthenticationService} from '../../../authentication/authentication.service';

@Component({
  selector: 'customer-service',
  templateUrl: './customer-service.component.html',
  styleUrls: ['./customer-service.component.scss']
})
export class CustomerServiceComponent implements OnInit {

  focusedItem: number;

  customers: Customer[] = [];
  sessions: Session[] = [];

  customerDebouncer: Subject<string> = new Subject();
  customerSub: Subscription;

  sessionDebouncer: Subject<string> = new Subject();
  sessionSub: Subscription;

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
    this.router.navigate(['/customers', event.option.value])
  }

  navigateToSession(event) {
    this.router.navigate(['/sessions', event.option.value])
  }
}
