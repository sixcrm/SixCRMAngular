import { Component, OnInit } from '@angular/core';
import {LoadBalancersService} from "../../shared/services/load-balancers.service";
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {LoadBalancer} from '../../shared/models/load-balancers.model';
import {Router, ActivatedRoute} from '@angular/router';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';

@Component({
  selector: 'load-balancers',
  templateUrl: './load-balancers.component.html',
  styleUrls: ['./load-balancers.component.scss']
})
export class LoadBalancersComponent extends AbstractEntityIndexComponent<LoadBalancer> implements OnInit {

  constructor(
    private loadBalancersService: LoadBalancersService,
    router: Router,
    route: ActivatedRoute,
    dialog: MdDialog,
    progressBarService: ProgressBarService
  ) {
    super(loadBalancersService, router, route, dialog, progressBarService);
  }

  ngOnInit() {
    this.loadBalancersService.entityDeleted$.subscribe(() => this.loadBalancersService.getEntities() );

    this.init();
  }

}
