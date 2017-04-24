import {Component, OnInit, OnDestroy} from '@angular/core';
import {LoadBalancersService} from "../../shared/services/load-balancers.service";
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {LoadBalancer} from '../../shared/models/load-balancers.model';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';
import {PaginationService} from '../../shared/services/pagination.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';

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
    progressBarService: ProgressBarService,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(loadBalancersService, auth, dialog, progressBarService, paginationService, router, activatedRoute);
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

}
