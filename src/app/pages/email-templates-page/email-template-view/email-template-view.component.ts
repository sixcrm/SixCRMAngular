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

declare var grapesjs;

@Component({
  selector: 'email-template-view',
  templateUrl: './email-template-view.component.html',
  styleUrls: ['./email-template-view.component.scss']
})
export class EmailTemplateViewComponent extends AbstractEntityViewComponent<EmailTemplate> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

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
    private router: Router
  ) {
    super(emailTemplateService, activatedRoute);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe(() => this.smtpProviderService.getEntities());
    this.emailTemplateService.tokenGroups.take(1).subscribe(groups => {
      const allTokensGroup: TokenGroup = new TokenGroup(groups.all);

      this.tokenGroups = [allTokensGroup];
      this.selectedGroup = allTokensGroup;

      this.allTokens = this.tokenGroups.map(g => g.tokens).reduce((a,b)=>a.concat(b), []);
    });

    this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe(() => {
      this.campaignsService.getEntities();
      this.productsService.getEntities();
      this.productSchedulesService.getEntities();
    });

    this.emailTemplateService.getTokens();
  }

  initGrapesJS() {
    this.grapesEditor = grapesjs.init({
      container : '#grapesjs',
      components: this.entity.body,
      css: this.entity.css,
      storageManager: { type: 'simple-storage' },
      blockManager: {
        blocks: [
          {
            id: 'header',
            label: '<b>Header</b>',
            content: `
                <section id="header-section">
                  Dear {{customer.firstname}} {{customer.lastname}}!
                </section>
                <br>
            `
          },
          {
            id: 'footer',
            label: '<b>Footer</b>',
            content: `
                <section id="footer-section">
                  Thank you for using ${this.authService.getActiveAccount().name}!
                </section>
            `
          },
          {
            id: 'order-summary',
            label: '<b>Order Summary</b>',
            content: `
                <section id="order-summary-section">
                  <div>Order Number: {{rebill.alias}}</div>
                  <div>Total Amount: \${{rebill.amount}}</div>
                </section>
                <br>
            `
          },
          {
            id: 'products-summary',
            label: '<b>Products Summary</b>',
            content: `
                <section id="products-summary-section">
                  {{#order.products}}
                  <div>{{product.name}} \${{amount}} x {{quantity}}</div>
                  {{/order.products}}
                </section>
                <br>
            `
          },
          {
            id: 'customer-summary',
            label: '<b>Customer Summary</b>',
            content: `
                <section id="customer-summary-section">
                  <div>Customer Information</div>
                  <div>{{customer.firstname}} {{customer.lastname}}</div>
                  <div>{{customer.address.line1}}, {{customer.address.line2}}</div>
                  <div>{{customer.address.city}} {{customer.address.state}}, {{customer.address.zip}}</div>
                </section>
                <br>
            `
          },
          {
            id: 'billing-summary',
            label: '<b>Billing Summary</b>',
            content: `
                <section id="billing-summary-section">
                  <div>Billing Information</div>
                  <div>{{creditcard.name}}</div>
                  <div>{{creditcard.type}} ****{{creditcard.last_four}}</div>
                  <div>{{creditcard.address.city}} {{creditcard.address.state}}, {{creditcard.address.zip}}</div>
                </section>
                <br>
            `
          }
        ]
      }
    });

    class Storage {
      constructor(private parent: EmailTemplateViewComponent) {};

      load(keys, clb, clbErr) {
        clb(keys);
      }

      store(data, clb, clbErr) {
        this.parent.entity.body = data['gjs-html'];
        this.parent.entity.css = data['gjs-css'];

        clb();
      }
    }

    this.grapesEditor.StorageManager.add('simple-storage', new Storage(this));
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    if (value === 1) {
      setTimeout(() => {
        this.initGrapesJS();
      }, 1);
    }

    this.selectedIndex = value;
  }

  cancelEdit(): void {
    this.setMode(this.modes.View);
    this.entity = this.entityBackup.copy();
  }

  addToken(token: Token) {
    if (this.viewMode) return;
  }

  sendTestEmail() {
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
