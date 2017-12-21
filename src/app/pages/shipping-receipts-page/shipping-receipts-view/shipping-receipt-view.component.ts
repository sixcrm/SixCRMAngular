import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {ShippingReceipt} from '../../../shared/models/shipping-receipt.model';
import {ShippingReceiptsService} from '../../../shared/services/shipping-receipts.service';

@Component({
  selector: 'shipping-receipt-view',
  templateUrl: './shipping-receipt-view.component.html',
  styleUrls: ['./shipping-receipt-view.component.scss']
})
export class ShippingReceiptViewComponent extends AbstractEntityViewComponent<ShippingReceipt> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

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
