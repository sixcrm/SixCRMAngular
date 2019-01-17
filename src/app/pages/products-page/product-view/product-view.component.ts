import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent, Modes} from '../../abstract-entity-view.component';
import {Product} from '../../../shared/models/product.model';
import {ProductsService} from '../../../entity-services/services/products.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {DeleteDialogComponent} from '../../../dialog-modals/delete-dialog.component';
import {SixImage} from '../../../shared/models/six-image.model';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {MatDialog} from '@angular/material';
import {Currency} from '../../../shared/utils/currency/currency';
import {FulfillmentProvidersService} from '../../../entity-services/services/fulfillment-providers.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {FulfillmentProvider} from '../../../shared/models/fulfillment-provider.model';
import {MerchantProviderGroupAssociation} from '../../../shared/models/merchant-provider-group-association.model';
import {MerchantProviderGroupAssociationsService} from '../../../entity-services/services/merchant-provider-group-associations.service';
import {merchantProviderGroupAssociationsByEntityListQuery} from '../../../shared/utils/queries/entities/merchant-provider-group-associations.queries';
import {MerchantProviderGroupsService} from '../../../entity-services/services/merchant-provider-groups.service';
import {Campaign} from '../../../shared/models/campaign.model';
import {MerchantProviderGroup} from '../../../shared/models/merchant-provider-group.model';
import {CampaignsService} from '../../../entity-services/services/campaigns.service';
import {MerchantProviderGroupAssociationDialogComponent} from '../../../dialog-modals/merchantprovidergroup-association-dialog/merchantprovidergroup-association-dialog.component';
import {ProductScheduleService} from '../../../entity-services/services/product-schedule.service';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {Schedule} from '../../../shared/models/schedule.model';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {EmailTemplatesService} from '../../../entity-services/services/email-templates.service';

@Component({
  selector: 'product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent extends AbstractEntityViewComponent<Product> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  fulfillmentProviders: FulfillmentProvider[] = [];

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'GENERAL'},
    {name: 'emails', label: 'EMAILS'}
  ];

  secondaryTabHeaders: TabHeaderElement[] = [
    {name: 'info', label: 'INFO'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'Products and Schedules', url: '/products'},
    {label: () => this.entityBackup ? this.entityBackup.name : ''}
  ];

  infoVisible: boolean = true;

  editMain: boolean;
  editSecondary: boolean;
  editDescription: boolean;

  merchantAssociation: MerchantProviderGroupAssociation = new MerchantProviderGroupAssociation();
  merchantAssociationBackup: MerchantProviderGroupAssociation = new MerchantProviderGroupAssociation();

  merchantProviderGroups: MerchantProviderGroup[] = [];
  campaigns: Campaign[] = [];

  fulfillmentInvalid: boolean;


  emailTemplateMapper = (el: EmailTemplate) => el.name;
  emailTemplateColumnParams = [
    new ColumnParams('Name', (e: EmailTemplate) => e.name),
    new ColumnParams('Subject',(e: EmailTemplate) => e.subject),
    new ColumnParams('Type', (e: EmailTemplate) => e.type),
    new ColumnParams('SMTP Provider', (e: EmailTemplate) => e.smtpProvider.name)
  ];

  emailText: TableMemoryTextOptions = {
    title: 'Associated Email Templates',
    viewOptionText: 'View Email Template',
    associateOptionText: 'Associate Email Template',
    disassociateOptionText: 'Disassociate Email Template',
    associateModalTitle: 'Select Email Template',
    disassociateModalTitle: 'Are you sure you want to delete?',
    associateModalButtonText: 'ADD',
    noDataText: 'No Email Templates Found.'
  };

  constructor(
    service: ProductsService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    private dialog: MatDialog,
    private router: Router,
    public fulfillmentProviderService: FulfillmentProvidersService,
    private merchantAssociationsService: MerchantProviderGroupAssociationsService,
    private merchantProviderGroupsService: MerchantProviderGroupsService,
    private campaignService: CampaignsService,
    private productScheduleService: ProductScheduleService,
    private emailTemplateService: EmailTemplatesService
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new Product();
      this.entity.ship = true;
      this.entityBackup = this.entity.copy();
    }

    this.fulfillmentProviderService.entities$.take(1).subscribe(providers => {
      if (providers instanceof CustomServerError) return;

      this.fulfillmentProviders = providers;
    });

    this.merchantProviderGroupsService.entities$.take(1).subscribe(entities => {
      if (entities instanceof CustomServerError) return;

      this.merchantProviderGroups = entities;
    });

    this.campaignService.entities$.take(1).subscribe(entities => {
      if (entities instanceof CustomServerError) return;

      this.campaigns = entities;
    });

    this.fulfillmentProviderService.getEntities();
    this.merchantProviderGroupsService.getEntities();
    this.campaignService.getEntities();
    this.emailTemplateService.getEntities();

    this.merchantAssociationsService
      .planeCustomEntitiesQuery(merchantProviderGroupAssociationsByEntityListQuery(this.entityId, {}))
      .subscribe(associations => {
        if (associations && associations.length > 0) {
          this.merchantAssociation = associations[0];
          this.merchantAssociationBackup = this.merchantAssociation.copy();
        }
      });
  }

  onEntityUpdated(updated: Product) {
    const updatedBackup = updated.copy();

    if (this.editMain) {
      updated.name = this.entity.name;
    }

    if (this.editSecondary) {
      updated.sku = this.entity.sku;
      updated.defaultPrice = this.entity.defaultPrice;
      updated.ship = this.entity.ship;
      updated.shippingDelay = this.entity.shippingDelay;
      updated.fulfillmentProvider = this.entity.fulfillmentProvider;
    }

    if (this.editDescription) {
      updated.description = this.entity.description;
    }

    this.entity = updated;
    this.entityBackup = updatedBackup;
  }

  setEditMain() {
    super.setMode(Modes.Update);
    this.editMain = true;
  }

  setViewMain() {
    this.editMain = false;

    if (!this.editSecondary && !this.editDescription) {
      super.setMode(Modes.View);
    }
  }

  setEditSecondary() {
    super.setMode(Modes.Update);
    this.editSecondary = true;
  }

  setViewSecondary() {
    this.editSecondary = false;

    if (!this.editMain  && !this.editDescription) {
      super.setMode(Modes.View);
    }
  }

  setEditDescription() {
    super.setMode(Modes.Update);
    this.editDescription = true;
  }

  setViewDescription() {
    this.editDescription = false;

    if (!this.editMain  && !this.editSecondary) {
      super.setMode(Modes.View);
    }
  }

  setMode(mode: Modes): void {
    super.setMode(mode);

    if (mode === Modes.Update) {
      this.editMain = true;
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number) {
    this.selectedIndex = value;
  }

  remove(): void {
    let deleteDialogRef = this.dialog.open(DeleteDialogComponent);

    deleteDialogRef.afterClosed().takeUntil(this.unsubscribe$).subscribe(result => {
      deleteDialogRef = null;

      if (result && result.success) {
        this.service.entityDeleted$.take(1).takeUntil(this.unsubscribe$).subscribe(() => {
          this.navigation.back();
        });

        this.service.deleteEntity(this.entity.id);
      }
    });
  }

  addNewImage(image: SixImage) {
    const temp = this.entityBackup.copy();
    temp.attributes.images.push(image);

    this.service.updateEntity(temp);
  }

  deleteImage(image: SixImage) {
    for (let i = 0; i < this.entity.attributes.images.length; i++) {
      if (this.entity.attributes.images[i].path === image.path) {
        this.entity.attributes.images.splice(i, 1);

        this.updateEntity(this.entity);
        return;
      }
    }
  }

  updateDefaultImage(image: SixImage) {
    this.entityBackup.attributes.images = this.entityBackup.attributes.images.map(i => {
      i.defaultImage = i.path === image.path;

      return i;
    });

    this.updateEntity(this.entityBackup);
  }

  updateDescription() {
    const product = this.entityBackup.copy();
    product.description = this.entity.description;

    this.setViewDescription();
    this.updateEntity(product);
  }

  saveMain() {
    const product = this.entityBackup.copy();
    product.name = this.entity.name;

    this.setViewMain();
    this.service.updateEntity(product);

    this.saveMerchantAssociation();
  }

  saveMerchantAssociation(): void {
    if (!this.merchantAssociation.merchantProviderGroup.id) return;

    this.merchantAssociationsService.entityCreated$
      .merge(this.merchantAssociationsService.entityUpdated$)
      .take(1)
      .subscribe(association => {
        if (association instanceof CustomServerError) return;

        this.merchantAssociation = association;
        this.merchantAssociationBackup = this.merchantAssociation.copy();
      });

    if (this.merchantAssociation.id) {
      this.merchantAssociationsService.updateEntity(this.merchantAssociation);
    } else {
      this.merchantAssociationsService.createEntity(this.merchantAssociation);
    }
  }

  cancelEditMain() {
    this.entity.name = this.entityBackup.name;
    this.merchantAssociation = this.merchantAssociationBackup.copy();

    this.setViewMain();
  }

  cancelEditDescription() {
    this.entity.description = this.entityBackup.description;

    this.setViewDescription();
  }

  saveSecondary() {
    const product = this.entityBackup.copy();

    this.fulfillmentInvalid = this.entity.ship && !this.entity.fulfillmentProvider.name;

    if (this.fulfillmentInvalid) {
      return;
    }

    product.sku = this.entity.sku;
    product.ship = this.entity.ship;
    product.shippingDelay = this.entity.shippingDelay;
    product.defaultPrice = new Currency(this.entity.defaultPrice.amount);
    product.fulfillmentProvider = this.entity.fulfillmentProvider.copy();

    this.service.updateEntity(product);
    this.setViewSecondary();
  }

  cancelEditSecondary() {
    this.entity.sku = this.entityBackup.sku;
    this.entity.ship = this.entityBackup.ship;
    this.entity.shippingDelay = this.entityBackup.shippingDelay;
    this.entity.defaultPrice = new Currency(this.entityBackup.defaultPrice.amount);
    this.entity.fulfillmentProvider = this.entityBackup.fulfillmentProvider.copy();

    this.setViewSecondary();
  }

  selectProvider(provider: FulfillmentProvider) {
    if (this.editSecondary) {
      this.entity.fulfillmentProvider = provider;
    }
  }

  openMerchantAssociationModal() {
    if (!this.editMain) return;

    let ref = this.dialog.open(MerchantProviderGroupAssociationDialogComponent);
    ref.componentInstance.campaigns = this.campaigns;
    ref.componentInstance.merchantGroups = this.merchantProviderGroups;

    ref.afterClosed().takeUntil(this.unsubscribe$).subscribe(result => {
      ref = null;

      if (result && result.campaign && result.group) {
        if (!this.merchantAssociation) {
          this.merchantAssociation = new MerchantProviderGroupAssociation();
        }

        this.merchantAssociation.entityType = 'product';
        this.merchantAssociation.entity = this.entityId;
        this.merchantAssociation.campaign = result.campaign.copy();
        this.merchantAssociation.merchantProviderGroup = result.group.copy();
      }
    });
  }

  createSubscription() {
    const productSchedule = new ProductSchedule({name: `${this.entity.name} Subscription`});
    const schedule = new Schedule({start: 0, period: 30, end: 0, product: this.entity.copy(), price: this.entity.defaultPrice.amount});

    productSchedule.schedules = [schedule];

    this.productScheduleService.fetchCreateEntity(productSchedule).subscribe(ps => {
      if (ps instanceof CustomServerError) return;

      this.router.navigate(['/products', 'schedule', ps.id], {fragment: 'cycles'});
    })
  }

  priceUpdated(price: Currency) {
    this.entity.defaultPrice = price;
  }


  viewEmailTemplate(emailTemplate: EmailTemplate): void {
    this.router.navigate(['/emailtemplates', emailTemplate.id]);
  }

  disassociateEmailTemplate(emailTemplate: EmailTemplate): void {
    this.emailTemplateService.removeEmailTemplateAssociation(emailTemplate.id, 'product', this.entityId).subscribe((template) => {
      if (template instanceof CustomServerError || !template) return;

      this.entity.emailTemplates = this.entity.emailTemplates.filter(e => e.id !== template.id);
    });
  }

  associateEmailTemplate(emailTemplate: EmailTemplate): void {
    this.emailTemplateService.addEmailTemplateAssociation(emailTemplate.id, 'product', this.entityId).subscribe((template) => {
      if (template instanceof CustomServerError || !template) return;

      this.entity.emailTemplates = [...this.entity.emailTemplates, template];
    });
  }
}
