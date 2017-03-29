import { Component, OnInit } from '@angular/core';
import {AbstractEntityComponent} from '../../abstract-entity-component';
import {LoadBalancersService} from '../../../shared/services/load-balancers.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {LoadBalancer} from '../../../shared/models/load-balancers.model';

@Component({
  selector: 'load-balancer',
  templateUrl: './load-balancer.component.html',
  styleUrls: ['./load-balancer.component.scss']
})
export class LoadBalancerComponent extends AbstractEntityComponent<LoadBalancer> implements OnInit {

  constructor(service: LoadBalancersService, progressBarService: ProgressBarService) {
    super(service, progressBarService);
  }

  ngOnInit() {
    this.init();
  }

}
