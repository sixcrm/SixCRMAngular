import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {Rebill} from '../../../../shared/models/rebill.model';
import {RebillsService} from '../../../../shared/services/rebills.service';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../../../shared/services/progress-bar.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {rebillsListQuery, rebillsByCustomer} from '../../../../shared/utils/query-builder';

@Component({
  selector: 'customer-rebills',
  templateUrl: './customer-rebills.component.html',
  styleUrls: ['./customer-rebills.component.scss']
})
export class CustomerRebillsComponent extends AbstractEntityIndexComponent<Rebill> implements OnInit, OnDestroy {

  @Input() id: string;

  constructor(
    rebillsService: RebillsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(rebillsService, auth, dialog, progressBarService, paginationService);
  }

  ngOnInit() {
    this.service.indexQuery = (limit?: number, cursor?: string) => rebillsByCustomer(this.id, limit, cursor);
    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = rebillsListQuery;
    this.destroy();
  }

}
