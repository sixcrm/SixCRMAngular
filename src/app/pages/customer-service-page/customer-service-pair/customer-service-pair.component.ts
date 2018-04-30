import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Customer} from '../../../shared/models/customer.model';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {CustomersService} from '../../../shared/services/customers.service';
import {SessionsService} from '../../../shared/services/sessions.service';
import {Session} from '../../../shared/models/session.model';
import {sessionQuery, sessionDetailedQuery} from '../../../shared/utils/queries/entities/session.queries';

@Component({
  selector: 'customer-service-pair',
  templateUrl: './customer-service-pair.component.html',
  styleUrls: ['./customer-service-pair.component.scss']
})
export class CustomerServicePairComponent implements OnInit, OnDestroy {

  customerId: string;
  sessionId: string;

  customer: Customer;
  session: Session;

  constructor(
    private route: ActivatedRoute,
    private customersService: CustomersService,
    private sessionService: SessionsService,
  ) { }

  ngOnInit() {
    this.sessionService.viewQuery = sessionDetailedQuery;

    this.customersService.entity$.take(1).subscribe(customer => {
      if (customer instanceof CustomServerError) {
        return;
      }

      this.customer = customer;
    });

    this.route.queryParams.take(1).subscribe(params => {
      this.customerId = params['customer'];
      this.sessionId = params['session'];

      if (this.customerId) {
        this.customersService.getEntity(this.customerId);
      } else if (this.sessionId) {

        this.sessionService.entity$.take(1).subscribe(session => {
          if (session instanceof CustomServerError) {
            return;
          }

          this.session = session;
          this.customerId = this.session.customer.id;

          this.customersService.getEntity(this.customerId);
        });

        this.sessionService.getEntity(this.sessionId);

      }
    });
  }

  ngOnDestroy() {
    this.sessionService.viewQuery = sessionQuery;
  }

}
