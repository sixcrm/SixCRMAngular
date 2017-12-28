import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {Bill} from '../../../shared/models/bill.model';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {BillsService} from '../../../shared/services/bills.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';

@Component({
  selector: 'bill-view',
  templateUrl: './bill-view.component.html',
  styleUrls: ['./bill-view.component.scss']
})
export class BillViewComponent extends AbstractEntityViewComponent<Bill> implements OnInit, OnDestroy {

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'BILL_TAB_GENERAL'}
  ];

  selectedIndex = 0;

  constructor(
    service: BillsService,
    route: ActivatedRoute,
    private navigation: NavigationService
  ) {
    super(service, route)
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(index: number) {
    this.selectedIndex = index;
  }
}
