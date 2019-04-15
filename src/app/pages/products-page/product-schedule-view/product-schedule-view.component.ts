import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {AbstractEntityViewComponent, Modes} from '../../abstract-entity-view.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {utc, Moment} from 'moment'
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from '../../../dialog-modals/delete-dialog.component';
import {MerchantProviderGroupsService} from '../../../entity-services/services/merchant-provider-groups.service';
import {MerchantProviderGroup} from '../../../shared/models/merchant-provider-group.model';
import {ProductScheduleService} from '../../../entity-services/services/product-schedule.service';
import {SmsProvider} from '../../../shared/models/sms-provider.model';
import {SmsProvidersService} from '../../../entity-services/services/sms-providers.service';

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

  productScheduleCycles: ProductSchedule;
  productScheduleCyclesStates: ProductSchedule[] = [];
  productScheduleCyclesIndex = 0;
  editDescription: boolean;
  editMain: boolean;

  merchantProviderGroups: MerchantProviderGroup[] = [];
  merchantProviderGroupsFiltered: MerchantProviderGroup[] = [];

  midFilter: string;
  smsFilter: string;

  smsProviders: SmsProvider[] = [];
  smsProvidersFiltered: SmsProvider[] = [];

  constructor(
    service: ProductScheduleService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog,
    public merchantProviderGroupsService: MerchantProviderGroupsService,
    public smsProviderService: SmsProvidersService
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.service.entity$.take(1).takeUntil(this.unsubscribe$).subscribe(productSchedule => {
      if (productSchedule instanceof CustomServerError) {
        return;
      }

      this.productScheduleCycles = productSchedule;
      this.productScheduleCyclesStates = [this.productScheduleCycles.copy()];
      this.productScheduleCyclesIndex = 0;
      this.midFilter = productSchedule.merchantProviderGroup.name || '';
      this.smsFilter = productSchedule.smsProvider.name || '';
    });

    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe(ps => {
      if (ps instanceof CustomServerError) return;

      this.entity = ps;
      this.entityBackup = this.entity.copy();
      this.midFilter = ps.merchantProviderGroup.name || '';
    });

    this.merchantProviderGroupsService.entities$.take(1).subscribe(groups => {
      if (groups instanceof CustomServerError) return;

      this.merchantProviderGroups = groups;
      this.merchantProviderGroupsFiltered = this.merchantProviderGroups.slice();
    });

    this.smsProviderService.entities$.take(1).subscribe(providers => {
      if (providers instanceof CustomServerError) return;

      this.smsProviders = providers;
      this.smsProvidersFiltered = this.smsProviders.slice();
    });

    this.merchantProviderGroupsService.getEntities();
    this.smsProviderService.getEntities();

    super.init(() => this.navigation.goToNotFoundPage());
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }

  canBeDeactivated() {
    return this.productScheduleCyclesStatePersisted()
      && this.entity.name === this.entityBackup.name
      && this.entity.merchantProviderGroup.id === this.entityBackup.merchantProviderGroup.id;
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

  saveProductScheduleCycles(productSchedule: ProductSchedule) {
    this.productScheduleCyclesStates = this.productScheduleCyclesStates.slice(0, this.productScheduleCyclesIndex + 1);
    this.productScheduleCyclesStates.push(productSchedule.copy());
    this.productScheduleCycles = productSchedule.copy();
    this.productScheduleCyclesIndex++;

    this.service.updateEntity(this.productScheduleCycles);
  }

  productScheduleCyclesStatePersisted() {
    return JSON.stringify(this.productScheduleCycles.inverse().cycles)
      === JSON.stringify(this.productScheduleCyclesStates[this.productScheduleCyclesIndex].inverse().cycles)
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
    if (this.entity.trialRequired && !this.entity.smsProvider.id) return;

    this.updateEntity(this.entity);
    this.editMain = false;
  }

  cancelEditMain() {
    this.cancelUpdate();
    this.midFilter = this.entity.merchantProviderGroup.name;
    this.editMain = false;
  }

  midInputChanged() {
    this.entity.merchantProviderGroup = new MerchantProviderGroup();

    if (!this.midFilter) {
      this.merchantProviderGroupsFiltered = this.merchantProviderGroups.slice();

      return;
    }

    this.merchantProviderGroupsFiltered = this.merchantProviderGroups
      .filter(g => g.name.indexOf(this.midFilter) !== -1);

    for (let i = 0; i < this.merchantProviderGroupsFiltered.length; i++) {
      if (this.merchantProviderGroupsFiltered[i].name === this.midFilter) {
        this.entity.merchantProviderGroup = this.merchantProviderGroupsFiltered[i].copy();

        return;
      }
    }
  }

  midSelected(option) {
    this.entity.merchantProviderGroup = option.option.value.copy();
    this.midFilter = this.entity.merchantProviderGroup.name;
  }

  smsInputChanged() {
    this.entity.smsProvider = new SmsProvider();

    if (!this.smsFilter) {
      this.smsProvidersFiltered = this.smsProviders.slice();

      return;
    }

    this.smsProvidersFiltered = this.smsProviders
      .filter(g => g.name.indexOf(this.smsFilter) !== -1);

    for (let i = 0; i < this.smsProvidersFiltered.length; i++) {
      if (this.smsProvidersFiltered[i].name === this.smsFilter) {
        this.entity.smsProvider = this.smsProvidersFiltered[i].copy();

        return;
      }
    }
  }

  smsSelected(option) {
    this.entity.smsProvider = option.option.value.copy();
    this.smsFilter = this.entity.smsProvider.name;
  }

  cancelProductScheduleCyclesChanges() {
    this.productScheduleCycles = this.productScheduleCyclesStates[this.productScheduleCyclesIndex].copy();
  }
}
