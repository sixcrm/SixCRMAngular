import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Bill} from '../../../../shared/models/bill.model';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {BillsService} from '../../../../shared/services/bills.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'bills-overview',
  templateUrl: './bills-overview.component.html',
  styleUrls: ['./bills-overview.component.scss']
})
export class BillsOverviewComponent  extends AbstractEntityIndexComponent<Bill> implements OnInit, OnDestroy {

  overdue: Bill[] = [];
  paid: Bill[] = [];
  unpaid: Bill[] = [];

  addMode: boolean;
  billToUpdate: Bill;

  @Input() focused: boolean;

  constructor(
    billsService: BillsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(billsService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new Bill();

    this.shareLimit = false;
    this.limit = null;
  }

  ngOnInit() {
    this.init();

    this.allEntities.takeUntil(this.unsubscribe$).subscribe((bills: Bill[]) => {
      this.overdue = bills.filter(bill => bill.outstanding);
      this.paid = bills.filter(bill => !bill.outstanding && bill.paid);
      this.unpaid = bills.filter(bill => !bill.outstanding && !bill.paid);
    })
  }

  ngOnDestroy() {
    this.destroy();
  }

  createNewInvoice(): void {
    this.billToUpdate = new Bill();
    this.addMode = true;
  }

  viewInvoice(bill: Bill): void {
    this.billToUpdate = bill.copy();
    this.addMode = true;
  }

}
