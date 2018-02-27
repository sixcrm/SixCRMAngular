import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {CreditCardsService} from '../../../shared/services/credit-cards.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {Customer} from '../../../shared/models/customer.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {BreadcrumbItem} from '../../components/entity-view-breadcrumbs/entity-view-breadcrumbs.component';

@Component({
  selector: 'credit-card-view',
  templateUrl: './credit-card-view.component.html',
  styleUrls: ['./credit-card-view.component.scss']
})
export class CreditCardViewComponent extends AbstractEntityViewComponent<CreditCard> implements OnInit, OnDestroy {

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'CREDITCARD_TAB_GENERAL'},
    {name: 'customers', label: 'CREDITCARD_TAB_CUSTOMER'}
  ];

  isViewMode: boolean = true;

  customerColumnParams: ColumnParams<Customer>[] = [
    new ColumnParams('CREDITCARD_CUSTOMER_NAME', (e: Customer) => `${e.firstName} ${e.lastName}`),
    new ColumnParams('CREDITCARD_CUSTOMER_CITY', (e: Customer) => e.address.city),
    new ColumnParams('CREDITCARD_CUSTOMER_STATE', (e: Customer) => e.address.state),
    new ColumnParams('CREDITCARD_CUSTOMER_ZIP', (e: Customer) => e.address.zip)
  ];

  customerTextOptions: TableMemoryTextOptions = {
    title: 'CREDITCARD_CUSTOMER_TITLE',
    viewOptionText: 'CREDITCARD_CUSTOMER_VIEW',
    noDataText: 'CREDITCARD_CUSTOMER_NODATA'
  };

  selectedIndex: number = 0;

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'CREDITCARD_INDEX_TITLE', url: '/creditcards'},
    {label: () => this.entity.name}
  ];

  constructor(
    private router: Router,
    service: CreditCardsService,
    route: ActivatedRoute,
    public navigation: NavigationService
  ) {
    super(service, route);
  }

  ngOnInit() {
    super.init();

    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe(() => {
      this.isViewMode = true;
    })
  }

  ngOnDestroy() {
    this.destroy();
  }

  enterEditMode(): void {
    this.isViewMode = false;
  }

  doCancel(): void {
    this.isViewMode = true;

    this.cancelUpdate();
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }

  viewCustomer(customer: Customer) {
    this.router.navigate(['/customers', customer.id]);
  }

}
