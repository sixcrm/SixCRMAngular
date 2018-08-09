import {Component, OnInit, OnDestroy} from '@angular/core';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {EmailTemplatesService} from '../../../entity-services/services/email-templates.service';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {SmtpProvidersService} from '../../../entity-services/services/smtp-providers.service';
import {Token, TokenGroup} from './token-list/token-list.component';
import {Subject} from 'rxjs';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {EmailTemplatesSharedService} from '../../../entity-services/services/email-templates-shared.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {firstIndexOf} from '../../../shared/utils/array.utils';
import {SnackbarService} from '../../../shared/services/snackbar.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';

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
    {name: 'preview', label: 'EMAILTEMPLATE_TAB_PREVIEW'}
  ];

  breadcrumbs: BreadcrumbItem[] = [
    {label: () => 'EMAILTEMPLATE_INDEX_TITLE', url: '/emailtemplates'},
    {label: () => this.entity.name}
  ];

  isShared: boolean;

  tokenGroups: TokenGroup[] = [];
  selectedGroup: TokenGroup;
  allTokens: Token[] = [];

  constructor(
    private emailTemplateService: EmailTemplatesService,
    private activatedRoute: ActivatedRoute,
    public navigation: NavigationService,
    public smtpProviderService: SmtpProvidersService,
    private sharedService: EmailTemplatesSharedService,
    public authService: AuthenticationService,
    private snackService: SnackbarService
  ) {
    super(emailTemplateService, activatedRoute);
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe(data => {
      if (data[0].path === 'shared') {
        this.service = this.sharedService;
        this.isShared = true;
      }

      this.init(() => this.navigation.goToNotFoundPage());
    });


    this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe(() => this.smtpProviderService.getEntities());
    this.emailTemplateService.tokenGroups.take(1).subscribe(groups => {
      const allTokensGroup: TokenGroup = new TokenGroup(groups.all);

      this.tokenGroups = [allTokensGroup];
      this.selectedGroup = allTokensGroup;

      this.allTokens = this.tokenGroups.map(g => g.tokens).reduce((a,b)=>a.concat(b), []);
    });

    this.emailTemplateService.getTokens();
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

}
