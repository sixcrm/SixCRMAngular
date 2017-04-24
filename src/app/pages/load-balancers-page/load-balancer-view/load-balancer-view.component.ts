import { Component, OnInit } from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {LoadBalancer} from '../../../shared/models/load-balancers.model';
import {LoadBalancersService} from '../../../shared/services/load-balancers.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'load-balancer-view',
  templateUrl: './load-balancer-view.component.html',
  styleUrls: ['./load-balancer-view.component.scss']
})
export class LoadBalancerViewComponent extends AbstractEntityViewComponent<LoadBalancer> implements OnInit {

  constructor(service: LoadBalancersService, route: ActivatedRoute, progressBarService: ProgressBarService, public navigation: NavigationService) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    super.init();
  }

}
