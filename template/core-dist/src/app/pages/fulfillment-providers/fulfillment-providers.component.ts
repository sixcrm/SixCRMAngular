import { Component, OnInit } from '@angular/core';
import {FulfillmentProvidersService} from "../../shared/services/fulfillment-providers.service";
import {FulfillmentProvider} from '../../shared/models/fulfillment-provider.model';
import {Router} from '@angular/router';

@Component({
  selector: 'fulfillment-providers',
  templateUrl: './fulfillment-providers.component.html',
  styleUrls: ['./fulfillment-providers.component.scss']
})
export class FulfillmentProvidersComponent implements OnInit {
  private fulfillmentProviders: FulfillmentProvider[] = [];

  constructor(private fulfillmentProvidersService: FulfillmentProvidersService, private router: Router) { }

  ngOnInit() {
    this.fulfillmentProvidersService.fulfillmentProviders$.subscribe((data) => this.fulfillmentProviders = data);
    this.fulfillmentProvidersService.getFulfillmentProviders()
  }

  viewFulfillmentProvider(fulfillmentProvider: FulfillmentProvider): void {
    this.router.navigateByUrl('/dashboard/fulfillmentProviders/' + fulfillmentProvider.id);
  }

  editFulfillmentProvider(fulfillmentProvider: FulfillmentProvider): void {

  }

  deleteFulfillmentProvider(fulfillmentProvider: FulfillmentProvider): void {

  }
}
