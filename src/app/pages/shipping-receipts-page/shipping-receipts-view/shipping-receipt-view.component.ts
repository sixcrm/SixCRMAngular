import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {ShippingReceipt} from '../../../shared/models/shipping-receipt.model';
import {ShippingReceiptsService} from '../../../shared/services/shipping-receipts.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';

@Component({
  selector: 'shipping-receipt-view',
  templateUrl: './shipping-receipt-view.component.html',
  styleUrls: ['./shipping-receipt-view.component.scss']
})
export class ShippingReceiptViewComponent extends AbstractEntityViewComponent<ShippingReceipt> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'SHIPPINGRECEIPT_TAB_GENERAL'}
  ];

  constructor(service: ShippingReceiptsService,
              route: ActivatedRoute,
              public navigation: NavigationService,
  ) {
    super(service, route);
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());
  }

  ngOnDestroy() {
    this.destroy();
  }

}
