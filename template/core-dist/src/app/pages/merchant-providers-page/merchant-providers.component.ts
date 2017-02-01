import { Component, OnInit } from '@angular/core';
import {MerchantProvidersService} from "../../shared/services/merchant-providers.service";

@Component({
  selector: 'merchant-providers',
  templateUrl: './merchant-providers.component.html',
  styleUrls: ['./merchant-providers.component.scss']
})
export class MerchantProvidersComponent implements OnInit {

  constructor(private merchantProvidersService: MerchantProvidersService) { }

  ngOnInit() {
  }

}
