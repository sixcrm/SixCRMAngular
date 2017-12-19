import {Component, OnInit, OnDestroy} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {RebillsService} from '../../../shared/services/rebills.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'rebill-view',
  templateUrl: './rebill-view.component.html',
  styleUrls: ['./rebill-view.component.scss']
})
export class RebillViewComponent extends AbstractEntityViewComponent<Rebill> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  billdate: string;
  billamount: string;
  parentsession: string;
  customername: string;
  customerid: string;

  constructor(
    service: RebillsService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public router: Router
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe(entity => {
      if (entity instanceof CustomServerError) {
        this.router.navigate(['/error']);
        return;
      }

      this.billdate = entity.billAt.format('MM/DD/YYYY');
      this.billamount = entity.amount.usd();
      this.parentsession = entity.parentSession.id;
      this.customername = entity.parentSession.customer.firstName + ' ' + entity.parentSession.customer.lastName;
      this.customerid = entity.parentSession.customer.id;
    })
  }

  goToSession() {
    if (!this.parentsession) return;

    this.router.navigate(['/sessions', this.parentsession]);
  }

  goToCustomer() {
    if (!this.customerid) return;

    this.router.navigate(['/customers', this.customerid]);
  }

  ngOnDestroy() {
    this.destroy();
  }
}
