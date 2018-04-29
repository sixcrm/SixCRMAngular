import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {MatDialog} from '@angular/material';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {RebillsService} from '../../../../shared/services/rebills.service';
import {CustomerRebillsComponent} from '../../../customers-page/customer-view/customer-rebills/customer-rebills.component';
import {utc} from 'moment';
import {Rebill} from '../../../../shared/models/rebill.model';

@Component({
  selector: 'customer-service-rebills',
  templateUrl: './customer-service-rebills.component.html',
  styleUrls: ['./customer-service-rebills.component.scss']
})
export class CustomerServiceRebillsComponent extends CustomerRebillsComponent implements OnInit, OnDestroy {

  utcf = utc;

  rebills: Rebill[] = [];

  constructor(
    rebillsService: RebillsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService
  ) {
    super(rebillsService, auth, dialog, paginationService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.allEntities.takeUntil(this.unsubscribe$).subscribe(rebills => {
      this.rebills = rebills.map(rebill => {
        const day = rebill.parentSession.createdAt.diff(rebill.billAt, 'd');

        rebill.productSchedules = rebill.productSchedules.map(ps => {
          ps.schedulesOnDay = ps.calculateSchedulesOnDay(day);

          return ps;
        });

        return rebill;
      })
    })
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
