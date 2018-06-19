import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {ShippingReceipt} from '../../../shared/models/shipping-receipt.model';
import {ShippingReceiptsService} from '../../../entity-services/services/shipping-receipts.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';

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

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'SHIPPINGRECEIPT_INDEX_TITLE', url: '/shippingreceipts'},
    {label: () => this.entity.id}
  ];

  constructor(service: ShippingReceiptsService,
              route: ActivatedRoute,
              public navigation: NavigationService,
              private router: Router
  ) {
    super(service, route);
  }

  goToFulfillmentProvider(): void {
    if (this.entity.fulfillmentProvider.id) {
      this.router.navigate(['/fulfillmentproviders', this.entity.fulfillmentProvider.id])
    }
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());
  }

  ngOnDestroy() {
    this.destroy();
  }

}
