import {Component, OnInit, ViewChild} from '@angular/core';
import {Transaction} from '../../../shared/models/transaction.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {TransactionsService} from '../../../shared/services/transactions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {NavigationService} from '../../../navigation/navigation.service';
import {createNumberMask} from 'text-mask-addons/dist/textMaskAddons';

@Component({
  selector: 'transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss']
})
export class TransactionViewComponent extends AbstractEntityViewComponent<Transaction> implements OnInit {

  @ViewChild('refundInput') refundInput;

  selectedIndex: number = 0;
  amountToRefund;
  refundAllSelected: boolean = false;

  numberMask = createNumberMask({
    prefix: '$',
    allowDecimal: true
  });

  constructor(
    private transactionsService: TransactionsService,
    route: ActivatedRoute,
    progressBar: ProgressBarService,
    public navigation: NavigationService,
    private router: Router
  ) {
    super(transactionsService, route, progressBar);
  }

  ngOnInit() {
    this.takeUpdated = false;
    super.init();
  }

  navigateTo(root: string, path: string): void {
    if (path) {
      this.router.navigate([root, path]);
    }
  }

  refundTransaction(): void {
    let amount;

    if (this.amountToRefund) {
      let temp = this.amountToRefund.replace(/$|,/g, '');
      if (temp.charAt(0) === '$') {
        temp = temp.slice(1);
      }
      amount = temp ? +temp : 0;
    } else {
      amount = 0;
    }

    if (amount > this.entity.amount.amount || amount === 0) {
      this.amountToRefund = '$0';
      this.refundInput.nativeElement.focus();
      return;
    }

    this.transactionsService.entityUpdated$.take(1).subscribe(() => {
      this.progressBarService.hideTopProgressBar();
      this.setIndex(0)
    });
    this.progressBarService.showTopProgressBar();
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
