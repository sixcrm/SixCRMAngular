import {Component, OnInit, Input} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';

@Component({
  selector: 'customer-advanced-subscriptions',
  templateUrl: './customer-advanced-subscriptions.component.html',
  styleUrls: ['./customer-advanced-subscriptions.component.scss']
})
export class CustomerAdvancedSubscriptionsComponent implements OnInit {

  @Input() rebills: Rebill[];
  @Input() sessionMode: boolean;

  filterString: string;
  filterMapper = (rebill: Rebill) => !this.filterString || rebill.alias.toLowerCase().includes(this.filterString.toLowerCase());

  constructor() { }

  ngOnInit() {
  }
}
