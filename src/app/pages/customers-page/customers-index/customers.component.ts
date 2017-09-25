import {Component, OnInit, OnDestroy} from '@angular/core';
import {CustomersService} from "../../../shared/services/customers.service";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {Customer} from '../../../shared/models/customer.model';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {areEntitiesIdentical} from '../../../shared/utils/entity.utils';
import {YesNoDialogComponent} from '../../yes-no-dialog.component';

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent extends AbstractEntityIndexComponent<Customer> implements OnInit, OnDestroy {

  showAddDialog: boolean;
  customer: Customer = new Customer();

  constructor(
    customersService: CustomersService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(customersService, auth, dialog, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('First Name', (e: Customer) => e.firstName),
      new ColumnParams('Last Name',(e: Customer) => e.lastName),
      new ColumnParams('State', (e: Customer) => e.address.state),
      new ColumnParams('City', (e: Customer) => e.address.city)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  hideDialog() {
    if (areEntitiesIdentical(this.customer, new Customer())) {
      this.showAddDialog = false;
      return;
    }

    let yesNoDialogRef = this.deleteDialog.open(YesNoDialogComponent, { disableClose : true });
    yesNoDialogRef.componentInstance.text = 'Are you sure you want to leave?';
    yesNoDialogRef.componentInstance.secondaryText = 'You have unsaved changes, if you leave changes will be discarded.';
    yesNoDialogRef.componentInstance.yesText = 'Proceed';
    yesNoDialogRef.componentInstance.noText = 'Cancel';

    yesNoDialogRef.afterClosed().take(1).subscribe(result => {
      yesNoDialogRef = null;

      if (result.success) {
        this.showAddDialog = false;
      }
    });
  }

  showDialog() {
    this.customer = new Customer();
    this.showAddDialog = true;
  }

  saveCustomer() {
    this.service.createEntity(this.customer);
    this.showAddDialog = false;
  }

}
