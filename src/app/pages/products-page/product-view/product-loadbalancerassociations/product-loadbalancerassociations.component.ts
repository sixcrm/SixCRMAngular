import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {LoadBalancerAssociation} from '../../../../shared/models/load-balancer-association.model';
import {LoadBalancerAssociationsService} from '../../../../shared/services/load-balancer-associations.service';
import {DeleteDialogComponent} from '../../../delete-dialog.component';
import {LoadBalancersService} from '../../../../shared/services/load-balancers.service';
import {CampaignsService} from '../../../../shared/services/campaigns.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {LoadBalancer} from '../../../../shared/models/load-balancer.model';
import {Campaign} from '../../../../shared/models/campaign.model';
import {campaignsInfoListQuery} from '../../../../shared/utils/queries/entities/campaign.queries';
import {MerchantProviderGroupAssociationDialogComponent} from '../../../../dialog-modals/merchantprovidergroup-association-dialog/merchantprovidergroup-association-dialog.component';
import {
  loadBalancerAssociationsListQuery,
  loadBalancerAssociationsByEntityListQuery
} from '../../../../shared/utils/queries/entities/load-balancer-associations.queries';

@Component({
  selector: 'product-loadbalancerassociations',
  templateUrl: './product-loadbalancerassociations.component.html',
  styleUrls: ['./product-loadbalancerassociations.component.scss']
})
export class ProductLoadBalancerAssociationsComponent extends AbstractEntityIndexComponent<LoadBalancerAssociation> implements OnInit, OnDestroy {

  @Input() id: string;

  loadBalancers: LoadBalancer[];
  campaigns: Campaign[];

  dependenciesLoaded: boolean;

  constructor(
    loadBalancerAssociationService: LoadBalancerAssociationsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    private loadBalancerService: LoadBalancersService,
    private campaignService: CampaignsService
  ) {
    super(loadBalancerAssociationService, auth, dialog, paginationService, router, activatedRoute);

    this.columnParams = [
      new ColumnParams('PRODUCT_MERCHANTGROUPASSOCIATION_ID', (e: LoadBalancerAssociation) => e.id).setSelected(false),
      new ColumnParams('PRODUCT_MERCHANTGROUPASSOCIATION_MERCHANTGROUP', (e: LoadBalancerAssociation) => e.loadbalancer.name),
      new ColumnParams('PRODUCT_MERCHANTGROUPASSOCIATION_CAMPAIGN', (e: LoadBalancerAssociation) => e.campaign.name)
    ];

    this.viewAfterCrate = false;
  }

  ngOnInit() {
    this.service.indexQuery = (limit?:number, cursor?:string, search?: string) => loadBalancerAssociationsByEntityListQuery(this.id, limit, cursor, search);

    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = loadBalancerAssociationsListQuery;

    this.destroy();
  }

  removeAssociation(loadBalancerAssociation: LoadBalancerAssociation) {
    let ref = this.deleteDialog.open(DeleteDialogComponent);

    ref.afterClosed().takeUntil(this.unsubscribe$).subscribe(result => {
      ref = null;
      if (result && result.success) {
        this.service.deleteEntity(loadBalancerAssociation.id);
      }
    });
  }

  showAddAssociation() {
    if (this.dependenciesLoaded) {
      this.showModal();

      return;
    }

    this.loadBalancerService.entities$.merge(this.campaignService.entities$)
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
    this.loadBalancerService.entities$.takeUntil(this.unsubscribe$).subscribe(entities => {
      if (entities instanceof CustomServerError) return;

      this.loadBalancers = entities;
    });

    this.campaignService.entities$.takeUntil(this.unsubscribe$).subscribe(entities => {
      if (entities instanceof CustomServerError) return;

      this.campaigns = entities;
    });

    this.loadBalancerService.getEntities();

    let q = this.campaignService.indexQuery;
    this.campaignService.indexQuery = campaignsInfoListQuery;
    this.campaignService.getEntities();
    this.campaignService.indexQuery = q;
  }

  showModal() {
    let ref = this.deleteDialog.open(MerchantProviderGroupAssociationDialogComponent);

    ref.componentInstance.campaigns = this.campaigns;
    ref.componentInstance.merchantGroups = this.loadBalancers;

    ref.afterClosed().takeUntil(this.unsubscribe$).subscribe(result => {
      ref = null;
      if (result && result.campaign && result.group) {
        const lba = new LoadBalancerAssociation();
        lba.entityType = 'product';
        lba.entity = this.id;
        lba.campaign = result.campaign.copy();
        lba.loadbalancer = result.group.copy();

        this.service.createEntity(lba);
      }
    });
  }
}
