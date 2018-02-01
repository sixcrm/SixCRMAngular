import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {CreditCard} from '../../../shared/models/credit-card.model';
import {CreditCardsService} from '../../../shared/services/credit-cards.service';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';

@Component({
  selector: 'credit-card-view',
  templateUrl: './credit-card-view.component.html',
  styleUrls: ['./credit-card-view.component.scss']
})
export class CreditCardViewComponent extends AbstractEntityViewComponent<CreditCard> implements OnInit, OnDestroy {

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'CREDITCARD_TAB_GENERAL'}
  ];

  isViewMode: boolean = true;

  constructor(service: CreditCardsService, route: ActivatedRoute, public navigation: NavigationService) {
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

}
