import { Component, OnInit } from '@angular/core';
import {LoadBalancer} from '../../../shared/models/load-balancers.model';
import {LoadBalancersService} from '../../../shared/services/load-balancers.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'c-load-balancer-view',
  templateUrl: './load-balancer-view.component.html',
  styleUrls: ['./load-balancer-view.component.scss']
})
export class LoadBalancerViewComponent implements OnInit {
  private loadBalancer: LoadBalancer;

  constructor(private loadBalancersService: LoadBalancersService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadBalancersService.loadBalancer$.subscribe((data) => { this.loadBalancer = data });
    this.route.params.subscribe((params: Params) => {
      this.loadBalancersService.getLoadBalancer(params['id']);
    });
  }
}
