import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Transaction} from '../../../shared/models/transaction.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {TransactionsService} from '../../../shared/services/transactions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {getCurrencyMask, parseCurrencyMaskedValue} from '../../../shared/utils/mask.utils';

@Component({
  selector: 'transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss']
})
export class TransactionViewComponent extends AbstractEntityViewComponent<Transaction> implements OnInit, OnDestroy {

  @ViewChild('refundInput') refundInput;

  selectedIndex: number = 0;
  amountToRefund;
  refundAllSelected: boolean = false;

  numberMask = getCurrencyMask();

  constructor(
    private transactionsService: TransactionsService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    private router: Router
  ) {
    super(transactionsService, route);
  }

  ngOnInit() {
    this.takeUpdated = false;
    super.init(() => this.navigation.goToNotFoundPage());
  }

  ngOnDestroy() {
    this.destroy();
  }

  navigateTo(root: string, path: string): void {
    if (path) {
      this.router.navigate([root, path]);
    }
  }

  refundTransaction(): void {
    let amount = parseCurrencyMaskedValue(this.amountToRefund);

    if (amount > this.entity.amount.amount || amount === 0) {
      this.amountToRefund = '$0';
      this.refundInput.nativeElement.focus();
      return;
    }

    this.transactionsService.entityUpdated$.take(1).subscribe(() => {
      this.setIndex(0)
    });
    this.transactionsService.refundTransaction(this.entity.id, amount);
  }

  refundAllSelect(): void {
    if (this.refundAllSelected) {
      this.amountToRefund = this.entity.amount.amount;
    } else {
      this.amountToRefund = '$0';
    }
  }

  setIndex(index: number): void {
    if (index === 1) {
      this.amountToRefund = '$0';
      this.refundAllSelected = false;
    }

    this.selectedIndex = index;
  }
}
