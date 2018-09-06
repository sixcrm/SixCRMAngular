import {
  Component, OnInit, OnDestroy, ComponentFactoryResolver, ApplicationRef, Injector,
  EmbeddedViewRef
} from '@angular/core';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {EmailTemplatesService} from '../../../entity-services/services/email-templates.service';
import {AbstractEntityViewComponent, Modes} from '../../abstract-entity-view.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {SmtpProvidersService} from '../../../entity-services/services/smtp-providers.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {SnackbarService} from '../../../shared/services/snackbar.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {CampaignsService} from '../../../entity-services/services/campaigns.service';
import {ProductsService} from '../../../entity-services/services/products.service';
import {ProductScheduleService} from '../../../entity-services/services/product-schedule.service';
import {TableMemoryTextOptions} from '../../components/table-memory/table-memory.component';
import {Campaign} from '../../../shared/models/campaign.model';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {Product} from '../../../shared/models/product.model';
import {ProductSchedule} from '../../../shared/models/product-schedule.model';
import {initGrapesJS} from './grapes-template-builder';
import {MatDialog} from '@angular/material';
import {CustomTokenBlockDialogComponent} from '../../../dialog-modals/custom-token-block-dialog/custom-token-block-dialog.component';
import {DeleteDialogComponent} from '../../../dialog-modals/delete-dialog.component';
import {EmailTemplateAddNewComponent} from './email-template-add-new/email-template-add-new.component';
import {EmailTemplatePreviewModalComponent} from '../../../dialog-modals/email-template-preview-modal/email-template-preview-modal.component';
import {AccountDetailsService} from '../../../entity-services/services/account-details.service';
import {CustomBlock} from '../../../shared/models/account-details.model';

export class TokenGroup {

  name: string;
  description: string;
  tokens: Token[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.name = obj.name || '';
    this.description = obj.description || '';
    this.tokens = (obj.tokens || []).map(t => new Token(t));
  }

}

export class Token {

  value: string;
  description: string;
  example: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.description = obj.description || '';
    this.value = obj.value || '';
    this.example = obj.example || '';
  }

  contains(filter: string) {
    return (this.value || '').toLowerCase().indexOf((filter || '').toLowerCase()) !== -1
      || (this.description || '').toLowerCase().indexOf((filter || '').toLowerCase()) !== -1;
  }

}

@Component({
  selector: 'email-template-view',
  templateUrl: './email-template-view.component.html',
  styleUrls: ['./email-template-view.component.scss']
})
export class EmailTemplateViewComponent extends AbstractEntityViewComponent<EmailTemplate> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'GENERAL'},
    {name: 'associations', label: 'ASSOCIATIONS'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'Email Templates', url: '/emailtemplates'},
    {label: () => this.entity.name}
  ];

  campaignMapper = (el: Campaign) => el.name;
  campaignColumnParams = [
    new ColumnParams('Name', (e: Campaign) => e.name)
  ];

  campaignText: TableMemoryTextOptions = {
    title: 'Campaigns',
    viewOptionText: 'View Campaign',
    associateOptionText: 'Add Campaign',
    disassociateOptionText: 'Delete Campaign',
    associateModalTitle: 'Select Campaign',
    disassociateModalTitle: 'Are you sure you want to delete?',
    associateModalButtonText: 'ADD',
    noDataText: 'No Campaigns are associated to this email template.'
  };

  productMapper = (el: Product) => el.name;
  productColumnParams = [
    new ColumnParams('Name', (e: Product) => e.name),
    new ColumnParams('SKU', (e: Product) => e.sku),
    new ColumnParams('Default Price', (e: Product) => e.defaultPrice.usd()),
    new ColumnParams('Ship', (e: Product) => !!e.ship + '')
  ];

  productText: TableMemoryTextOptions = {
    title: 'Products',
    viewOptionText: 'View Product',
    associateOptionText: 'Associate Product',
    disassociateOptionText: 'Disassociate Product',
    associateModalTitle: 'Select Product',
    disassociateModalTitle: 'Are you sure you want to delete?',
    associateModalButtonText: 'ADD',
    noDataText: 'No Products are associated to this email template.'
  };

  productScheduleMapper = (el: ProductSchedule) => el.name;
  productScheduleColumnParams = [
    new ColumnParams('Name', (e: ProductSchedule) => e.name),
    new ColumnParams('Number of cycles', (e: ProductSchedule) => e.schedules.length)
  ];

  productScheduleText: TableMemoryTextOptions = {
    title: 'Product Schedules',
    viewOptionText: 'View Product Schedule',
    associateOptionText: 'Associate Product Schedule',
    disassociateOptionText: 'Disassociate Product Schedule',
    associateModalTitle: 'Select Product Schedule',
    disassociateModalTitle: 'Are you sure you want to delete?',
    associateModalButtonText: 'ADD',
    noDataText: 'No Product Schedules are associated to this email template.'
  };

  allTokens: Token[];
  customBlocks: CustomBlock[];

  grapesEditor;
  templateBody: string;
  lastSavedTemplateBody: string;

  constructor(
    private emailTemplateService: EmailTemplatesService,
    private activatedRoute: ActivatedRoute,
    public navigation: NavigationService,
    public smtpProviderService: SmtpProvidersService,
    public accountDetailsService: AccountDetailsService,
    public authService: AuthenticationService,
    private snackService: SnackbarService,
    public campaignsService: CampaignsService,
    public productsService: ProductsService,
    public productSchedulesService: ProductScheduleService,
    private router: Router,
    private dialog: MatDialog,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
    super(emailTemplateService, activatedRoute);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe((template) => {
      if (template instanceof CustomServerError) return;

      this.templateBody = template.body;
      this.lastSavedTemplateBody = this.templateBody;

      this.smtpProviderService.getEntities()
    });

    this.emailTemplateService.tokenGroups.take(1).subscribe(groups => {
      const allTokensGroup: TokenGroup = new TokenGroup(groups.all);

      this.allTokens = [allTokensGroup].map(g => g.tokens).reduce((a,b)=>a.concat(b), []);
    });

    this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe(() => {
      this.campaignsService.getEntities();
      this.productsService.getEntities();
      this.productSchedulesService.getEntities();
    });

    this.accountDetailsService.entity$.take(1).subscribe(accountDetails => {
      if (accountDetails instanceof CustomServerError) return;

      this.customBlocks = accountDetails.emailTemplateSettings.customBlocks;
    });

    this.service.entity$.zip(this.service.entity$).zip(this.accountDetailsService.entity$).take(1).subscribe(() => {
      if (this.selectedIndex === 0) {
        setTimeout(() => {
          this.initGrapes();
        }, 25);
      }
    });

    this.emailTemplateService.getTokens();
    this.accountDetailsService.getEntity(this.authService.getActiveAccount().id);
  }

  initGrapes() {
    this.grapesEditor = initGrapesJS(
      {
        targetId: '#grapesjs',
        parent: this,
        saveCallback: () => {
          this.entity.body = this.templateBody;
          this.lastSavedTemplateBody = this.templateBody;
          this.updateEntity(this.entity);
        },
        previewCallback: () => {
          this.emailTemplateService.getTemplatePreview(this.templateBody).subscribe(preview => {
            let ref = this.dialog.open(EmailTemplatePreviewModalComponent, {backdropClass: 'backdrop-blue'});
            ref.componentInstance.body = preview;

            ref.afterClosed().subscribe(() => {
              ref = null;
            })
          });
        },
        saveCustomBlockCallback: (body: string) => {
          let dialog = this.dialog.open(CustomTokenBlockDialogComponent);

          return dialog.afterClosed().take(1).flatMap(result => {
            dialog = null;

            if (!result || !result.title) {
              return [{success: false, block: null}];
            }

            const block = new CustomBlock({id: new Date().getTime() + '', body: body, title: result.title});

            return this.accountDetailsService.addCustomBlock(block).flatMap(res => [{success: res, block: block}]);
          });
        },
        deleteCustomBlockCallback: (block: CustomBlock) => {
          let dialog = this.dialog.open(DeleteDialogComponent);
          dialog.componentInstance.text = `Are you sure you want to delete '${block.title}' custom token?`;

          return dialog.afterClosed().take(1).flatMap(result => {
            if (!result || !result.success) {
              return [{success: false, block: null}];
            }

            return this.accountDetailsService.removeCustomBlock(block).flatMap(res => [{success: res, block: block}])
          });
        }
      }
    );

    this.appendEmailTemplateUpdateComponentToGrapes();
  }

  appendEmailTemplateUpdateComponentToGrapes() {
    // create EmailTemplateAddNewComponent template using ng component factory resolver
    const ref = this.componentFactoryResolver
      .resolveComponentFactory(EmailTemplateAddNewComponent)
      .create(this.injector);

    ref.instance.entity = this.entity;
    ref.instance.mode = Modes.Update;
    ref.instance.save.takeUntil(this.unsubscribe$).subscribe((template) => {
      template.body = this.templateBody;
      this.updateEntity(template);
    });
    this.service.entityUpdated$.takeUntil(this.unsubscribe$).subscribe((updatedTemplate) => {
      if (updatedTemplate instanceof CustomServerError) return;

      ref.instance.entity = updatedTemplate;
    });

    this.appRef.attachView(ref.hostView);

    // append email template add new component before first grapesJS block category
    const templateEditElement = (ref.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    const blockContainer = document.getElementsByClassName('gjs-block-categories')[0];

    blockContainer.insertBefore(templateEditElement, blockContainer.firstChild);
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    if (this.selectedIndex !== 0 && this.entity && this.allTokens && this.customBlocks && value === 0) {
      setTimeout(() => {
        this.initGrapes();
      }, 25);
    }

    this.selectedIndex = value;
  }

  isTemplateChanged(): boolean {
    if (this.templateBody.length !== this.lastSavedTemplateBody.length) return true;

    return this.templateBody !== this.lastSavedTemplateBody;
  }

  sendTestEmail(): void {
    if (this.isTemplateChanged()) {
      this.snackService.showErrorSnack('Please save changes before sending a test email.', 2500);
      return;
    }

    this.emailTemplateService.sendTestEmail(this.entity).subscribe((result) => {
      if (result instanceof CustomServerError) {
        this.snackService.showErrorSnack('Error when sending test E-Mail', 2500);
        return;
      }

      this.snackService.showSuccessSnack('Test E-Mail Sent', 2500);
    })
  }

  viewCampaign(campaign: Campaign): void {
    this.router.navigate(['/campaigns', campaign.id]);
  }

  disassociateCampaign(campaign: Campaign): void {
    let index = firstIndexOf(this.entity.campaigns, (el) => el.id === campaign.id);

    if (index > -1) {
      this.entity.campaigns.splice(index, 1);
      this.entity.campaigns = this.entity.campaigns.slice();

      this.updateEntity(this.entity);
    }
  }

  associateCampaign(campaign: Campaign): void {
    let list = this.entity.campaigns.slice();
    list.push(campaign);

    this.entity.campaigns = list;

    this.updateEntity(this.entity);
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }

  disassociateProduct(product: Product): void {
    let index = firstIndexOf(this.entity.products, (el) => el.id === product.id);

    if (index > -1) {
      this.entity.products.splice(index, 1);
      this.entity.products = this.entity.products.slice();

      this.updateEntity(this.entity);
    }
  }

  associateProduct(product: Product): void {
    let list = this.entity.products.slice();
    list.push(product);

    this.entity.products = list;

    this.updateEntity(this.entity);
  }

  viewProductSchedule(productSchedule: ProductSchedule): void {
    this.router.navigate(['/productschedules', productSchedule.id]);
  }

  disassociateProductSchedule(productSchedule: ProductSchedule): void {
    let index = firstIndexOf(this.entity.productSchedules, (el) => el.id === productSchedule.id);

    if (index > -1) {
      this.entity.productSchedules.splice(index, 1);
      this.entity.productSchedules = this.entity.productSchedules.slice();

      this.updateEntity(this.entity);
    }
  }

  associateProductSchedule(productSchedule: ProductSchedule): void {
    let list = this.entity.productSchedules.slice();
    list.push(productSchedule);

    this.entity.productSchedules = list;

    this.updateEntity(this.entity);
  }

}
