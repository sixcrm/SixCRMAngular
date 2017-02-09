import { Component, OnInit } from '@angular/core';
import {LoadBalancersService} from "../../shared/services/load-balancers.service";
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {LoadBalancer} from '../../shared/models/load-balancers.model';
import {Router, ActivatedRoute} from '@angular/router';
import {MdDialog} from '@angular/material';

@Component({
  selector: 'load-balancers',
  templateUrl: './load-balancers.component.html',
  styleUrls: ['./load-balancers.component.scss']
})
export class LoadBalancersComponent extends AbstractEntityIndexComponent<LoadBalancer> implements OnInit {

  private loadBalancers: LoadBalancer[] = [];

  constructor(private loadBalancersService: LoadBalancersService, router: Router, route: ActivatedRoute, dialog: MdDialog) {
    super(loadBalancersService, router, route, dialog);
  }

  ngOnInit() {
    this.loadBalancersService.entities$.subscribe((data) => this.loadBalancers = data );
    this.loadBalancersService.entityDeleted$.subscribe(() => this.loadBalancersService.getEntities() );
    this.loadBalancersService.getEntities();
  }

}
