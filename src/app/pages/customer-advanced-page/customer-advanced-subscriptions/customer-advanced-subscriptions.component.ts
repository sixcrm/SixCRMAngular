import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {Session} from '../../../shared/models/session.model';

@Component({
  selector: 'customer-advanced-subscriptions',
  templateUrl: './customer-advanced-subscriptions.component.html',
  styleUrls: ['./customer-advanced-subscriptions.component.scss']
})
export class CustomerAdvancedSubscriptionsComponent implements OnInit {

  @Input() rebills: Rebill[];
  @Input() confirmationSessions: Session[] = [];
  @Input() sessionMode: boolean;

  @Output() confirmDelivery: EventEmitter<Session> = new EventEmitter();
  @Output() confirmTrial: EventEmitter<Session> = new EventEmitter();

  filterString: string;
  filterMapper = (rebill: Rebill) => !this.filterString
    || `${rebill.alias} ${rebill.productSchedules.map(ps => ps.name).reduce((a,b)=>`${a} ${b}`, '')} ${rebill.products.map(p => p.product.name).reduce((a,b)=>`${a} ${b}`, '')} ${rebill.parentSession.campaign.name}`
          .toLowerCase().includes(this.filterString.toLowerCase());

  constructor() { }

  ngOnInit() {
  }
}
