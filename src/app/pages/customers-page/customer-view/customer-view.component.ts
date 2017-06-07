import {Component, OnInit, OnDestroy} from '@angular/core';
import {Customer} from '../../../shared/models/customer.model';
import {CustomersService} from '../../../shared/services/customers.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {ActivatedRoute} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {NavigationService} from '../../../navigation/navigation.service';
import {conformToMask} from 'angular2-text-mask';

@Component({
  selector: 'customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})
export class CustomerViewComponent extends AbstractEntityViewComponent<Customer> implements OnInit, OnDestroy {
  selectedIndex: number = 0;

  mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    service: CustomersService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService,
    public navigation: NavigationService
  ) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.init();
  }

  getPhoneNumber(): string {
    if (!this.entity || !this.entity.phone) return '';

    return conformToMask(this.entity.phone, this.mask, {guide: false}).conformedValue;
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(index: number): void {
    this.selectedIndex = index;
  }
}
