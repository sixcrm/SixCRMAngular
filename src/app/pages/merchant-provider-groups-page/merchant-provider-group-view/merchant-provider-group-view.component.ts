import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {MerchantProviderGroup} from '../../../shared/models/merchant-provider-group.model';
import {MerchantProviderGroupsService} from '../../../shared/services/merchant-provider-groups.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {MerchantProviderConfiguration} from '../../../shared/models/merchant-provider-configuration.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {MerchantProvidersService} from '../../../shared/services/merchant-providers.service';
import {MerchantProvider} from '../../../shared/models/merchant-provider/merchant-provider.model';
import {
  CustomMenuOption, CustomMenuOptionResult,
  TableMemoryTextOptions
} from '../../components/table-memory/table-memory.component';
import {MdDialog} from '@angular/material';
import {SingleInputDialogComponent} from '../../../dialog-modals/single-input-dialog.component';
import {isAllowedFloatNumeric} from '../../../shared/utils/form.utils';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/entity-view-breadcrumbs/entity-view-breadcrumbs.component';

@Component({
  selector: 'merchant-provider-group-view',
  templateUrl: './merchant-provider-group-view.component.html',
  styleUrls: ['./merchant-provider-group-view.component.scss']
})
export class MerchantProviderGroupViewComponent extends AbstractEntityViewComponent<MerchantProviderGroup> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  merchantProviderColumnParams = [
    new ColumnParams('MERCHANTPROVIDERGROUP_MERCHANT_MERCHANT', (e: MerchantProviderConfiguration) => e.merchantProvider.name),
    new ColumnParams('MERCHANTPROVIDERGROUP_MERCHANT_DISTRIBUTION',(e: MerchantProviderConfiguration) => e.distribution, 'right').setNumberOption(true)
  ];
  merchantProviderConfigMapper = (e: MerchantProviderConfiguration) => e.merchantProvider.name;
  merchantText: TableMemoryTextOptions = {
    title: 'MERCHANTPROVIDERGROUP_MERCHANT_TITLE',
    viewOptionText: 'MERCHANTPROVIDERGROUP_MERCHANT_VIEW',
    disassociateOptionText: 'MERCHANTPROVIDERGROUP_MERCHANT_DISASSOCIATE',
    disassociateModalTitle: 'MERCHANTPROVIDERGROUP_MERCHANT_DISASSOCIATETEXT',
    noDataText: 'MERCHANTPROVIDERGROUP_MERCHANT_NODATA'
  };

  providerToAdd: MerchantProviderConfiguration = new MerchantProviderConfiguration();
  merchantProviderMapper = (e: MerchantProvider) => e.name;

  formInvalid: boolean;
  detailsFormInvalid: boolean;

  customOptions: CustomMenuOption[] = [{label: 'MERCHANTPROVIDERGROUP_MERCHANT_EDIT'}];

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'MERCHANTPROVIDERGROUP_TAB_GENERAL'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'MERCHANTPROVIDERGROUP_INDEX_TITLE', url: '/merchantprovidergroups'},
    {label: () => this.entity.name}
  ];

  constructor(service: MerchantProviderGroupsService,
              route: ActivatedRoute,
              public navigation: NavigationService,
              public router: Router,
              public merchantProviderService: MerchantProvidersService,
              public dialog: MdDialog
  ) {
    super(service, route);
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new MerchantProviderGroup();
      this.entityBackup = this.entity.copy();
      this.merchantProviderService.getEntities();
    }

    this.service.entity$.take(1).subscribe(() => this.merchantProviderService.getEntities());
    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe(() => this.clearAddProvider());
  }

  ngOnDestroy() {
    this.destroy();
  }

  navigateToMerchantProvider(config: MerchantProviderConfiguration): void {
    this.router.navigate(['/merchantproviders', config.merchantProvider.id]);
  }

  disassociateMerchantProvider(merchantProviderConfig: MerchantProviderConfiguration): void {
    let index = firstIndexOf(this.entity.merchantProviderConfigurations, (el: MerchantProviderConfiguration) => {
      return el.distribution === merchantProviderConfig.distribution
              && el.merchantProvider.id === merchantProviderConfig.merchantProvider.id;
    });

    if (index > -1) {
      this.entity.merchantProviderConfigurations.splice(index, 1);
      this.updateEntity(this.entity);
    }
  }

  clearAddProvider(): void {
    this.formInvalid = false;
    this.providerToAdd = new MerchantProviderConfiguration();
  }

  addProvider(valid: boolean): void {
    this.formInvalid = !valid;

    if (this.formInvalid) return;

    this.entity.merchantProviderConfigurations.push(this.providerToAdd);
    if (!this.addMode) {
      this.updateEntity(this.entity);
    } else {
      this.entity.merchantProviderConfigurations = this.entity.merchantProviderConfigurations.slice();
      this.clearAddProvider();
    }
  }

  canBeDeactivated() {
    return !this.providerToAdd.merchantProvider.id && !this.providerToAdd.distribution && this.checkIfChanged();
  }

  updateMerchantProviderGroup() {
    this.detailsFormInvalid = !this.entity.name;
    if (this.detailsFormInvalid) return;

    this.saveOrUpdate(this.entity);
  }

  openEditMerchantProviderModal(option: CustomMenuOptionResult) {
    const dialogRef = this.dialog.open(SingleInputDialogComponent);
    dialogRef.componentInstance.text = `Update distribution of ${option.entity.merchantProvider.name}`;
    dialogRef.componentInstance.inputContent = option.entity.distribution;
    dialogRef.componentInstance.inputPlaceholder = 'Distribution';
    dialogRef.componentInstance.yesText = 'Update';
    dialogRef.componentInstance.noText = 'Cancel';
    dialogRef.componentInstance.keydownAllowFunction = (key, currentValue) => {
      return isAllowedFloatNumeric(key)
    };

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.content) {
        this.updateMerchantProvider(option.entity.merchantProvider, result.content);
      }
    })
  }

  updateMerchantProvider(merchantProvider: MerchantProvider, distribution: string) {
    for (let i = 0; i < this.entity.merchantProviderConfigurations.length; i++) {
      if (this.entity.merchantProviderConfigurations[i].merchantProvider.id === merchantProvider.id) {
        this.entity.merchantProviderConfigurations[i].distribution = distribution;
        this.updateEntity(this.entity);
        break;
      }
    }
  }
}