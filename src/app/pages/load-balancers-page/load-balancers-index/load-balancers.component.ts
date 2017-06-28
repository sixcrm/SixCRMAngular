import {Component, OnInit, OnDestroy} from '@angular/core';
import {LoadBalancersService} from "../../../shared/services/load-balancers.service";
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {LoadBalancer} from '../../../shared/models/load-balancer.model';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';

@Component({
  selector: 'load-balancers',
  templateUrl: './load-balancers.component.html',
  styleUrls: ['./load-balancers.component.scss']
})
export class LoadBalancersComponent extends AbstractEntityIndexComponent<LoadBalancer> implements OnInit, OnDestroy {

  constructor(
    loadBalancersService: LoadBalancersService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(loadBalancersService, auth, dialog, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('ID', (e: LoadBalancer) => e.id),
      new ColumnParams('Number Of Merchent Provider Configs',(e: LoadBalancer) => e.merchantProviderConfigurations.length.toString(), 'right')
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
