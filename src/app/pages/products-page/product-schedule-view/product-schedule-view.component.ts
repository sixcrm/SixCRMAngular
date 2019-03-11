import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProductScheduleService} from '../../../entity-services/services/product-schedule.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {utc, Moment} from 'moment'
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from '../../../dialog-modals/delete-dialog.component';
import {ProductScheduleCycles, getSimplerProductSchedule} from '../../../shared/models/product-schedule-cycles';
import {MerchantProviderGroupsService} from '../../../entity-services/services/merchant-provider-groups.service';
import {MerchantProviderGroup} from '../../../shared/models/merchant-provider-group.model';

@Component({
  selector: 'product-schedule-view',
  templateUrl: 'product-schedule-view.component.html',
  styleUrls: ['product-schedule-view.component.scss']
})
export class ProductScheduleViewComponent extends AbstractEntityViewComponent<ProductSchedule> implements OnInit, OnDestroy {

  @ViewChild('endField') endField;

  startDate: Moment = utc().millisecond(0).second(0).minute(0).hour(0);

  selectedIndex: number = 0;

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'GENERAL'},
    {name: 'cycles', label: 'CYCLES'},
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'Products and Schedules', url: '/products'},
    {label: () => `${this.entity.name}`}
  ];

  productScheduleCycles: ProductScheduleCycles;
  productScheduleCyclesStates: ProductScheduleCycles[] = [];
  productScheduleCyclesIndex = 0;
  editDescription: boolean;
  editMain: boolean;

  merchantProviderGroupMapper = (el: MerchantProviderGroup) => el.name || '-';
  merchantProviderGroups: MerchantProviderGroup[] = [];

  constructor(
    service: ProductScheduleService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog,
    public merchantProviderGroupsService: MerchantProviderGroupsService
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.service.entity$.take(1).takeUntil(this.unsubscribe$).subscribe(ps => {
      if (ps instanceof CustomServerError || !ps || !ps.id) {
        return;
      }

      this.productScheduleCycles = getSimplerProductSchedule(ps);
      this.productScheduleCyclesStates = [this.productScheduleCycles.copy()];
      this.productScheduleCyclesIndex = 0;
    });

    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe(ps => {
      if (ps instanceof CustomServerError) return;

      this.entity = ps;
      this.entityBackup = this.entity.copy();
    });

    this.merchantProviderGroupsService.entities$.take(1).subscribe(groups => {
      if (groups instanceof CustomServerError) return;

      this.merchantProviderGroups = groups;
    });

    this.merchantProviderGroupsService.getEntities();
    super.init(() => this.navigation.goToNotFoundPage());
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }

  canBeDeactivated() {
    return super.canBeDeactivated() && this.productScheduleCyclesStatePersisted();
  }

  deleteProductSchedule() {
    let deleteDialog = this.dialog.open(DeleteDialogComponent);

    deleteDialog.afterClosed().takeUntil(this.unsubscribe$).subscribe(result => {
      deleteDialog = null;
      if (result && result.success) {
        this.service.entityDeleted$.take(1).subscribe(data => {
          if (data instanceof CustomServerError) {
            return;
          }

          this.router.navigate(['/products']);
        });

        this.service.deleteEntity(this.entity.id);
      }
    });
  }

  revertProductScheduleCycles() {
    this.saveProductScheduleCycles(this.productScheduleCyclesStates[this.productScheduleCyclesIndex].copy());
  }

  redoProductScheduleCycles() {
    if (this.productScheduleCyclesIndex >= this.productScheduleCyclesStates.length - 1) return;

    this.productScheduleCyclesIndex++;
    this.productScheduleCycles = this.productScheduleCyclesStates[this.productScheduleCyclesIndex].copy();
  }

  undoProductScheduleCycles() {
    if (this.productScheduleCyclesIndex === 0) return;

    this.productScheduleCyclesIndex--;
    this.productScheduleCycles = this.productScheduleCyclesStates[this.productScheduleCyclesIndex].copy();
  }

  saveProductScheduleCycles(productScheduleCycles: ProductScheduleCycles) {
    this.productScheduleCyclesStates = this.productScheduleCyclesStates.slice(0, this.productScheduleCyclesIndex + 1);
    this.productScheduleCyclesStates.push(productScheduleCycles.copy());
    this.productScheduleCycles = productScheduleCycles.copy();
    this.productScheduleCyclesIndex++;
  }

  productScheduleCyclesStatePersisted() {
    return JSON.stringify(this.productScheduleCycles.inverse())
      === JSON.stringify(this.productScheduleCyclesStates[this.productScheduleCyclesIndex].inverse())
  }

  updateDescription() {
    this.editDescription = false;
  }

  cancelEditDescription() {
    this.editDescription = false;
  }

  setEditDescription() {
    this.editDescription = true;
  }

  setEditMain() {
    this.editMain = true;
  }

  saveMain() {
    this.updateEntity(this.entity);
    this.editMain = false;
  }

  cancelEditMain() {
    this.cancelUpdate();
    this.editMain = false;
  }
}
