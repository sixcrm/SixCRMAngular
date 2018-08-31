import {Component, OnInit, OnDestroy} from '@angular/core';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {EmailTemplatesService} from '../../../entity-services/services/email-templates.service';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {SmtpProvidersService} from '../../../entity-services/services/smtp-providers.service';
import {Token, TokenGroup} from './token-list/token-list.component';
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

@Component({
  selector: 'email-template-view',
  templateUrl: './email-template-view.component.html',
  styleUrls: ['./email-template-view.component.scss']
})
export class EmailTemplateViewComponent extends AbstractEntityViewComponent<EmailTemplate> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  tokensInited: boolean;

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'EMAILTEMPLATE_TAB_GENERAL'},
    {name: 'template', label: 'TEMPLATE'},
    {name: 'associations', label: 'TRIGGERS'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'EMAILTEMPLATE_INDEX_TITLE', url: '/emailtemplates'},
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
    noDataText: 'No Campaigns set as triggers.'
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
    noDataText: 'No Products set as triggers.'
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
    noDataText: 'No Product Schedules set as triggers.'
  };

  tokenGroups: TokenGroup[] = [];
  selectedGroup: TokenGroup;
  allTokens: Token[] = [];

  grapesEditor;
  templateBody: string;

  constructor(
    private emailTemplateService: EmailTemplatesService,
    private activatedRoute: ActivatedRoute,
    public navigation: NavigationService,
    public smtpProviderService: SmtpProvidersService,
    public authService: AuthenticationService,
    private snackService: SnackbarService,
    public campaignsService: CampaignsService,
    public productsService: ProductsService,
    public productSchedulesService: ProductScheduleService,
    private router: Router,
    private dialog: MatDialog
  ) {
    super(emailTemplateService, activatedRoute);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe((template) => {
      if (template instanceof CustomServerError) return;

      this.templateBody = template.body;
      this.smtpProviderService.getEntities()
    });

    this.emailTemplateService.tokenGroups.take(1).subscribe(groups => {
      const allTokensGroup: TokenGroup = new TokenGroup(groups.all);

      this.tokenGroups = [allTokensGroup];
      this.selectedGroup = allTokensGroup;

      this.allTokens = this.tokenGroups.map(g => g.tokens).reduce((a,b)=>a.concat(b), []);

      if (this.selectedIndex === 1 && !this.tokensInited) {
        this.initGrapes();
      }
    });

    this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe(() => {
      this.campaignsService.getEntities();
      this.productsService.getEntities();
      this.productSchedulesService.getEntities();
    });

    this.emailTemplateService.getTokens();
  }

  initGrapes() {
    this.grapesEditor = initGrapesJS(
      {
        targetId: '#grapesjs',
        parent: this,
        saveCallback: () => {
          this.entity.body = this.templateBody;
          this.updateEntity(this.entity);
        },
        saveCustomBlockCallback: (content: string) => {
          let dialog = this.dialog.open(CustomTokenBlockDialogComponent);

          return dialog.afterClosed().take(1).map(result => {
            dialog = null;

            if (!result || !result.title) {
              return {content: content, title: 'fail', success: false};
            }

            return {content: content, title: result.title, success: true};
          });

        },
        deleteCustomBlockCallback: (name: string) => {
          let dialog = this.dialog.open(DeleteDialogComponent);
          dialog.componentInstance.text = `Are you sure you want to delete '${name}' custom token?`;

          return dialog.afterClosed().take(1).map(result => {
            return result.success;
          })
        },
        testCallback: () => {
          this.sendTestEmail();
        },
        additionalFields: {
          accountName: this.authService.getActiveAccount().name
        }
      }
    );
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    if (value === 1) {
      setTimeout(() => {
        this.initGrapes();
      }, 1);
    }

    this.selectedIndex = value;
  }

  cancelEdit(): void {
    this.setMode(this.modes.View);
    this.entity = this.entityBackup.copy();
  }

  sendTestEmail(): void {
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
