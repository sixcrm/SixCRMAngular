import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProductScheduleService} from '../../../shared/services/product-schedule.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {Schedule} from '../../../shared/models/schedule.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Product} from '../../../shared/models/product.model';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {AddScheduleComponent} from '../../../shared/components/add-schedule/add-schedule.component';
import {LoadBalancersService} from '../../../shared/services/load-balancers.service';
import {LoadBalancer} from '../../../shared/models/load-balancer.model';

@Component({
  selector: 'product-schedule-view',
  templateUrl: './product-schedule-view.component.html',
  styleUrls: ['./product-schedule-view.component.scss']
})
export class ProductScheduleViewComponent extends AbstractEntityViewComponent<ProductSchedule> implements OnInit, OnDestroy {

  @ViewChild('endField') endField;
  @ViewChild('addScheduleComponent') addScheduleComponent: AddScheduleComponent;

  selectedIndex: number = 0;
  scheduleColumnParams = [
    new ColumnParams('Name', (e: Schedule) => e.product.name),
    new ColumnParams('Price', (e: Schedule) => e.price.usd(), 'right'),
    new ColumnParams('Start', (e: Schedule) => e.start, 'right'),
    new ColumnParams('End', (e: Schedule) => e.end, 'right'),
    new ColumnParams('Period', (e: Schedule) => e.period, 'right'),
    new ColumnParams('Ship', (e: Schedule) => e.product.ship)
  ];

  scheduleToAdd: Schedule = new Schedule();
  scheduleMapper = (s: Schedule) => s.product.name;

  formInvalid: boolean;
  loadBalancerMapper = (loadBalancer: LoadBalancer) => loadBalancer.name || loadBalancer.id;
  price: string = '';

  constructor(
    service: ProductScheduleService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public authService: AuthenticationService,
    private router: Router,
    public loadBalancerService: LoadBalancersService
  ) {
    super(service, route);
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new ProductSchedule();
      this.entityBackup = new ProductSchedule();
      this.loadBalancerService.getEntities();
    } else {
      this.service.entity$.take(1).takeUntil(this.unsubscribe$).subscribe(() => {
        this.loadBalancerService.getEntities();
      });
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }

  clearAddSchedule(): void {
    this.price = '';
    let loopProduct = this.scheduleToAdd ? this.scheduleToAdd.product : new Product();

    this.scheduleToAdd = new Schedule();
    this.scheduleToAdd.product = loopProduct.copy();
  }

  addScheduleToProduct(schedule: Schedule): void {
    this.entity.schedules.push(schedule);

    if (!this.addMode) {
      this.updateEntity(this.entity);
    } else {
      this.entity.schedules = this.entity.schedules.slice();
      this.clearAddSchedule();
    }
  }

  disassociateSchedule(schedule: Schedule) {
    let index = firstIndexOf(this.entity.schedules, (s: Schedule) => JSON.stringify(s) === JSON.stringify(schedule));

    if (index > -1) {
      this.entity.schedules.splice(index, 1);
      this.updateEntity(this.entity);
    }
  }

  navigateToProduct(schedule: Schedule) {
    this.router.navigate(['products', schedule.product.id])
  }

  canBeDeactivated() {
    return super.canBeDeactivated() && !this.addScheduleComponent.isTouched();
  }

  saveSchedule(valid) {
    this.formInvalid = !valid;
    if (this.formInvalid) return;

    this.saveEntity(this.entity)
  }
}
