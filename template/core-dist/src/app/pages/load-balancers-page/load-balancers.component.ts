import { Component, OnInit } from '@angular/core';
import {LoadBalancersService} from "../../shared/services/load-balancers.service";

@Component({
  selector: 'load-balancers',
  templateUrl: './load-balancers.component.html',
  styleUrls: ['./load-balancers.component.scss']
})
export class LoadBalancersComponent implements OnInit {

  constructor(private loadBalancersServices: LoadBalancersService) { }

  ngOnInit() {
  }

}
