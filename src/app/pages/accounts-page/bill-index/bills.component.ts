import {Component, OnInit, OnDestroy} from '@angular/core';
import {Bill} from '../../../shared/models/bill.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {BillsService} from '../../../shared/services/bills.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillIndexComponent  extends AbstractEntityIndexComponent<Bill> implements OnInit, OnDestroy {

  paid: Bill[] = [];
  unpaid: Bill[] = [];
  addMode: boolean;
  billToUpdate: Bill;

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

    this.allEntities.takeUntil(this.unsubscribe$).subscribe(bills => {
      this.paid = bills.filter(bill => bill.paid);
      this.unpaid = bills.filter(bill => !bill.paid);
    })
  }

  ngOnDestroy() {
    this.destroy();
  }

  createNewInvoice(): void {
    this.billToUpdate = new Bill();
    this.addMode = true;
  }

  updateInvoice(bill: Bill): void {
    this.billToUpdate = bill.copy();
    this.addMode = true;
  }

}
