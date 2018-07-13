import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {MerchantProvider} from '../../../shared/models/merchant-provider/merchant-provider.model';
import {MerchantProvidersService} from '../../../entity-services/services/merchant-providers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {MerchantProviderGroup} from '../../../shared/models/merchant-provider-group.model';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {TagsService} from '../../../entity-services/services/tags.service';

@Component({
  selector: 'merchant-provider-view',
  templateUrl: './merchant-provider-view.component.html',
  styleUrls: ['./merchant-provider-view.component.scss']
})
export class MerchantProviderViewComponent extends AbstractEntityViewComponent<MerchantProvider> implements OnInit, OnDestroy {

  @ViewChild('nameFieldAddMode') nameField;

  selectedIndex: number = 0;
  formInvalid: boolean;

  merchantProviderGroupColumnParams = [
    new ColumnParams('MERCHANTPROVIDER_MERCHANTPROVIDERGROUP_NAME', (e: MerchantProviderGroup) => e.name || e.id)
  ];
  merchantProviderGroupMapper = (l: MerchantProviderGroup) => l.name || l.id;
  merchantProviderGroupText: TableMemoryTextOptions = {
    title: 'MERCHANTPROVIDER_MERCHANTPROVIDERGROUP_TITLE',
    viewOptionText: 'MERCHANTPROVIDER_MERCHANTPROVIDERGROUP_VIEW',
    noDataText: 'MERCHANTPROVIDER_MERCHANTPROVIDERGROUP_NODATA'
  };

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'MERCHANTPROVIDER_TAB_GENERAL'},
    {name: 'precessing', label: 'MERCHANTPROVIDER_TAB_PROCESSING'},
    {name: 'merchantprovidergroups', label: 'MERCHANTPROVIDER_TAB_MERCHANTPROVIDERGROUP'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'MERCHANTPROVIDER_INDEX_TITLE', url: '/merchantproviders'},
    {label: () => this.entity.name}
  ];

  constructor(
    service: MerchantProvidersService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    private router: Router,
    public tagsService: TagsService
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new MerchantProvider();
      this.entityBackup = this.entity.copy();
      setTimeout(() => {if (this.nameField && this.nameField.nativeElement) this.nameField.nativeElement.focus()}, 50);
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  cancelEdit(): void {
    this.formInvalid = false;
    this.cancelUpdate();
  }

  saveProvider(entity: MerchantProvider): void {
    this.saveOrUpdate(entity);
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }

  navigateToMerchantProviderGroup(merchantProviderGroup: MerchantProviderGroup): void {
    this.router.navigate(['/merchantprovidergroups', merchantProviderGroup.id]);
  }
}
