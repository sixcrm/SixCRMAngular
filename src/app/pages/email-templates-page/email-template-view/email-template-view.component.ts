import {
  Component, OnInit, OnDestroy, ComponentFactoryResolver, ApplicationRef, Injector,
  EmbeddedViewRef
} from '@angular/core';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {EmailTemplatesService} from '../../../entity-services/services/email-templates.service';
import {AbstractEntityViewComponent, Modes} from '../../abstract-entity-view.component';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {SmtpProvidersService} from '../../../entity-services/services/smtp-providers.service';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {SnackbarService} from '../../../shared/services/snackbar.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {CampaignsService} from '../../../entity-services/services/campaigns.service';
import {ProductsService} from '../../../entity-services/services/products.service';
import {ProductScheduleService} from '../../../entity-services/services/product-schedule.service';
import {initGrapesJS} from './grapes-template-builder';
import {MatDialog} from '@angular/material';
import {CustomTokenBlockDialogComponent} from '../../../dialog-modals/custom-token-block-dialog/custom-token-block-dialog.component';
import {DeleteDialogComponent} from '../../../dialog-modals/delete-dialog.component';
import {EmailTemplateAddNewComponent} from './email-template-add-new/email-template-add-new.component';
import {EmailTemplatePreviewModalComponent} from '../../../dialog-modals/email-template-preview-modal/email-template-preview-modal.component';
import {AccountDetailsService} from '../../../entity-services/services/account-details.service';
import {CustomBlock} from '../../../shared/models/account-details.model';
import {GrapesFilterComponentComponent} from '../../../shared/components/grapes-filter-component/grapes-filter-component.component';

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

  allTokens: Token[];
  customBlocks: CustomBlock[];

  grapesEditor;
  templateBody: string;
  lastSavedTemplateBody: string;

  previewBody: string;

  chips: string[] = [];
  filterMapper = (el) => `${el.name} ${el.type}`;

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
      this.previewBody = template.preview;

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
    this.setFilterComponentsGrapesBlocks();
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

  setFilterComponentsGrapesBlocks() {
    const inputBuilder = (tokensBlockCategory) => {
      const ref = this.componentFactoryResolver
        .resolveComponentFactory(GrapesFilterComponentComponent)
        .create(this.injector);

      const tokensBlock = tokensBlockCategory.getElementsByClassName('gjs-blocks-c')[0];

      ref.instance.valueChanged.takeUntil(this.unsubscribe$).subscribe((value) => {
        const parsedValue = (value || '').toLowerCase();
        const items = tokensBlock.getElementsByClassName('gjs-block');

        for (let i = 0; i < items.length; i++) {
          const elementText = (items[i].getElementsByClassName('gjs-block-label')[0].innerHTML || '').toLowerCase();

          if (elementText.indexOf(parsedValue) === -1) {
            items[i].classList.add('invisible');
          } else {
            items[i].classList.remove('invisible');
          }
        }
      });

      this.appRef.attachView(ref.hostView);

      const filterComponent = (ref.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;

      tokensBlockCategory.insertBefore(filterComponent, tokensBlock);
    };

    inputBuilder(document.getElementsByClassName('gjs-block-category')[1]);
    inputBuilder(document.getElementsByClassName('gjs-block-category')[2]);
    if (document.getElementsByClassName('gjs-block-category')[3]) {
      inputBuilder(document.getElementsByClassName('gjs-block-category')[3]);
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    if (value === 0) {
      setTimeout(() => {
        this.initGrapes();
      }, 25);
    }

    if (value === 1) {
      this.setPreview();
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

  setPreview() {
    this.previewBody = '';

    if (this.templateBody) {
      this.emailTemplateService.getTemplatePreview(this.templateBody).subscribe(preview => {
        this.previewBody = preview;
      });
    }
  }

  addChip(event): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.chips = [...this.chips, value.trim()];
    }

    if (input) {
      input.value = '';
    }
  }

  remove(chip: string): void {
    this.chips = this.chips.filter(c => c !== chip);
  }

}
