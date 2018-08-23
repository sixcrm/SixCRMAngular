import {Component, OnInit, OnDestroy} from '@angular/core';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {EmailTemplatesService} from '../../../entity-services/services/email-templates.service';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {SmtpProvidersService} from '../../../entity-services/services/smtp-providers.service';
import {Token, TokenGroup} from './token-list/token-list.component';
import {Subject} from 'rxjs';
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

declare var tinymce;

@Component({
  selector: 'email-template-view',
  templateUrl: './email-template-view.component.html',
  styleUrls: ['./email-template-view.component.scss']
})
export class EmailTemplateViewComponent extends AbstractEntityViewComponent<EmailTemplate> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  addTokenSubject: Subject<Token> = new Subject();
  editorRefreshSubject: Subject<boolean> = new Subject();
  editorBodySubject: Subject<string> = new Subject();

  tabHeaders: TabHeaderElement[] = [
    {name: 'general', label: 'EMAILTEMPLATE_TAB_GENERAL'},
    {name: 'preview', label: 'EMAILTEMPLATE_TAB_PREVIEW'},
    {name: 'campaigns', label: 'CAMPAIGNS'},
    {name: 'products', label: 'PRODUCTS'},
    {name: 'productschedules', label: 'PRODUCT SCHEDULES'}
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
    title: 'Associated Campaigns',
    viewOptionText: 'View Campaign',
    associateOptionText: 'Associate Campaign',
    disassociateOptionText: 'Disassociate Campaign',
    associateModalTitle: 'Select Campaign',
    disassociateModalTitle: 'Are you sure you want to delete?',
    associateModalButtonText: 'ADD',
    noDataText: 'No Campaigns Found.'
  };

  productMapper = (el: Product) => el.name;
  productColumnParams = [
    new ColumnParams('Name', (e: Product) => e.name),
    new ColumnParams('SKU', (e: Product) => e.sku),
    new ColumnParams('Default Price', (e: Product) => e.defaultPrice.usd()),
    new ColumnParams('Ship', (e: Product) => !!e.ship + '')
  ];

  productText: TableMemoryTextOptions = {
    title: 'Associated Products',
    viewOptionText: 'View Product',
    associateOptionText: 'Associate Product',
    disassociateOptionText: 'Disassociate Product',
    associateModalTitle: 'Select Product',
    disassociateModalTitle: 'Are you sure you want to delete?',
    associateModalButtonText: 'ADD',
    noDataText: 'No Products Found.'
  };

  productScheduleMapper = (el: ProductSchedule) => el.name;
  productScheduleColumnParams = [
    new ColumnParams('Name', (e: ProductSchedule) => e.name),
    new ColumnParams('Number of cycles', (e: ProductSchedule) => e.schedules.length)
  ];

  productScheduleText: TableMemoryTextOptions = {
    title: 'Associated Product Schedules',
    viewOptionText: 'View Product Schedule',
    associateOptionText: 'Associate Product Schedule',
    disassociateOptionText: 'Disassociate Product Schedule',
    associateModalTitle: 'Select Product Schedule',
    disassociateModalTitle: 'Are you sure you want to delete?',
    associateModalButtonText: 'ADD',
    noDataText: 'No Product Schedules Found.'
  };

  tokenGroups: TokenGroup[] = [];
  selectedGroup: TokenGroup;
  allTokens: Token[] = [];

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

    this.emailTemplateService.getTokens();
    this.campaignsService.getEntities();
    this.productsService.getEntities();
    this.productSchedulesService.getEntities();
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    if (value === 0) {
      this.editorRefreshSubject.next(true);
    }

    this.selectedIndex = value;
  }

  cancelEdit(): void {
    this.setMode(this.modes.View);
    this.entity = this.entityBackup.copy();
    this.editorRefreshSubject.next(true);
  }

  addToken(token: Token) {
    if (this.viewMode) return;

    this.addTokenSubject.next(token);
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

  parseTemplateBody(): string {
    if (!this.entity || !this.entity.body) return '';

    if (!this.allTokens || this.allTokens.length === 0) return this.entity.body;

    const matches = this.entity.body.match(/{{.+?}}/g) || [];
    let result = this.entity.body;

    const strip = function (match) {
      return match.replace('{{', '').replace('}}', '');
    };

    const findTokenExample = (value) => {
      const index = firstIndexOf(this.allTokens, (token) => token.value === value);

      if (index === -1) return value;

      return this.allTokens[index].example;
    };

    matches.forEach((match) => {
      result = result.replace(new RegExp(match,'g'), findTokenExample(strip(match)));
    });

    return result;
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
