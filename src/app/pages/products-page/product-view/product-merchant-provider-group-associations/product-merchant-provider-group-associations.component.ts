import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {MerchantProviderGroupAssociation} from '../../../../shared/models/merchant-provider-group-association.model';
import {MerchantProviderGroupAssociationsService} from '../../../../shared/services/merchant-provider-group-associations.service';
import {DeleteDialogComponent} from '../../../delete-dialog.component';
import {MerchantProviderGroupsService} from '../../../../shared/services/merchant-provider-groups.service';
import {CampaignsService} from '../../../../shared/services/campaigns.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {MerchantProviderGroup} from '../../../../shared/models/merchant-provider-group.model';
import {Campaign} from '../../../../shared/models/campaign.model';
import {campaignsInfoListQuery} from '../../../../shared/utils/queries/entities/campaign.queries';
import {MerchantProviderGroupAssociationDialogComponent} from '../../../../dialog-modals/merchantprovidergroup-association-dialog/merchantprovidergroup-association-dialog.component';
import {
  merchantProviderGroupAssociationsListQuery,
  merchantProviderGroupAssociationsByEntityListQuery
} from '../../../../shared/utils/queries/entities/merchant-provider-group-associations.queries';
import {IndexQueryParameters} from '../../../../shared/utils/queries/index-query-parameters.model';
import {MatDialog} from '@angular/material';
import {PaginationService} from '../../../../shared/services/pagination.service';

@Component({
  selector: 'product-merchant-provider-group-associations',
  templateUrl: './product-merchant-provider-group-associations.component.html',
  styleUrls: ['./product-merchant-provider-group-associations.component.scss']
})
export class ProductMerchantProviderGroupAssociationsComponent extends AbstractEntityIndexComponent<MerchantProviderGroupAssociation> implements OnInit, OnDestroy {

  @Input() id: string;

  merchantProviderGroups: MerchantProviderGroup[];
  campaigns: Campaign[];

  dependenciesLoaded: boolean;

  constructor(
    merchantProviderGroupAssociationsService: MerchantProviderGroupAssociationsService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    private merchantProviderGroupsService: MerchantProviderGroupsService,
    private campaignService: CampaignsService
  ) {
    super(merchantProviderGroupAssociationsService, auth, dialog, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('PRODUCT_MERCHANTGROUPASSOCIATION_ID', (e: MerchantProviderGroupAssociation) => e.id).setSelected(false),
      new ColumnParams('PRODUCT_MERCHANTGROUPASSOCIATION_MERCHANTGROUP', (e: MerchantProviderGroupAssociation) => e.merchantProviderGroup.name),
      new ColumnParams('PRODUCT_MERCHANTGROUPASSOCIATION_CAMPAIGN', (e: MerchantProviderGroupAssociation) => e.campaign.name)
    ];

    this.viewAfterCrate = false;
  }

  ngOnInit() {
    this.service.indexQuery = (params: IndexQueryParameters) => merchantProviderGroupAssociationsByEntityListQuery(this.id, params);

    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = merchantProviderGroupAssociationsListQuery;

    this.destroy();
  }

  removeAssociation(merchantproviderGroupAssociation: MerchantProviderGroupAssociation) {
    let ref = this.deleteDialog.open(DeleteDialogComponent);

    ref.afterClosed().takeUntil(this.unsubscribe$).subscribe(result => {
      ref = null;
      if (result && result.success) {
        this.service.deleteEntity(merchantproviderGroupAssociation.id);
      }
    });
  }

  showAddAssociation() {
    if (this.dependenciesLoaded) {
      this.showModal();

      return;
    }

    this.merchantProviderGroupsService.entities$.merge(this.campaignService.entities$)
      .take(2)
      .skip(1)
      .takeUntil(this.unsubscribe$)
      .delay(100)
      .subscribe(() => {
        this.dependenciesLoaded = true;
        this.showModal()
      });

    this.fetchDependencies();
  }

  fetchDependencies() {
    this.merchantProviderGroupsService.entities$.takeUntil(this.unsubscribe$).subscribe(entities => {
      if (entities instanceof CustomServerError) return;

      this.merchantProviderGroups = entities;
    });

    this.campaignService.entities$.takeUntil(this.unsubscribe$).subscribe(entities => {
      if (entities instanceof CustomServerError) return;

      this.campaigns = entities;
    });

    this.merchantProviderGroupsService.getEntities();

    let q = this.campaignService.indexQuery;
    this.campaignService.indexQuery = campaignsInfoListQuery;
    this.campaignService.getEntities();
    this.campaignService.indexQuery = q;
  }

  showModal() {
    let ref = this.deleteDialog.open(MerchantProviderGroupAssociationDialogComponent);

    ref.componentInstance.campaigns = this.campaigns;
    ref.componentInstance.merchantGroups = this.merchantProviderGroups;

    ref.afterClosed().takeUntil(this.unsubscribe$).subscribe(result => {
      ref = null;
      if (result && result.campaign && result.group) {
        const lba = new MerchantProviderGroupAssociation();
        lba.entityType = 'product';
        lba.entity = this.id;
        lba.campaign = result.campaign.copy();
        lba.merchantProviderGroup = result.group.copy();

        this.service.createEntity(lba);
      }
    });
  }
}
