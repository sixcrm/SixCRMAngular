import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Session} from '../../../shared/models/session.model';
import {SessionsService} from '../../../shared/services/sessions.service';
import {Subscription} from 'rxjs';
import {sessionDetailedQuery, sessionQuery} from '../../../shared/utils/queries/entities/session.queries';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Transaction} from '../../../shared/models/transaction.model';

@Component({
  selector: 'customer-service-order',
  templateUrl: './customer-service-order.component.html',
  styleUrls: ['./customer-service-order.component.scss']
})
export class CustomerServiceOrderComponent implements OnInit, OnDestroy {

  @Input() customerId: string;

  selectedIndex: number = 0;
  purchasesIndex: number = 0;
  orderIndex: number = 0;

  selectedSession: Session;
  selectedSessionTransactions: Transaction[];

  sub: Subscription;

  constructor(private sessionService: SessionsService) { }

  ngOnInit() {
    this.sessionService.viewQuery = sessionDetailedQuery;
  }

  ngOnDestroy() {
    this.sessionService.viewQuery = sessionQuery;
  }

  openSession(session: Session) {
    this.selectedIndex = 1;
    this.orderIndex = 0;
    this.selectedSession = session;
    this.selectedSessionTransactions = undefined;

    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.sub = this.sessionService.entity$.take(1).subscribe(session => {
      if (session instanceof CustomServerError) return;

      this.selectedSession = session;
      this.selectedSessionTransactions = this.selectedSession.rebills.map(r => r.transactions).reduce((a,b) => [...a,...b], []);

      if (this.selectedSession.nextRebill) {
        this.selectedSession.nextRebill.productSchedules = this.selectedSession.nextRebill.productSchedules.map(ps => {
          const day = session.createdAt.diff(this.selectedSession.nextRebill.billAt, 'd');

          ps.schedulesOnDay = ps.calculateSchedulesOnDay(day);

          return ps;
        })
      }
    });

    this.sessionService.getEntity(session.id);
  }

  backToOrders() {
    this.selectedIndex = 0;
  }

  setPurchasesIndex(index: number) {
    this.purchasesIndex = index;
  }

  setOrderIndex(index: number) {
    this.orderIndex = index;
  }

}
