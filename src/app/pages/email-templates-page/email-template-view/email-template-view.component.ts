import {Component, OnInit, OnDestroy} from '@angular/core';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {EmailTemplatesService} from '../../../entity-services/services/email-templates.service';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {SmtpProvidersService} from '../../../entity-services/services/smtp-providers.service';
import {Token} from './token-list/token-list.component';
import {Subject} from 'rxjs';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {BreadcrumbItem} from '../../components/models/breadcrumb-item.model';
import {EmailTemplatesSharedService} from '../../../entity-services/services/email-templates-shared.service';
import {AuthenticationService} from '../../../authentication/authentication.service';

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

  constructor(
    service: EmailTemplatesService,
    private activatedRoute: ActivatedRoute,
    public navigation: NavigationService,
    public smtpProviderService: SmtpProvidersService,
    private sharedService: EmailTemplatesSharedService,
    public authService: AuthenticationService
  ) {
    super(service, activatedRoute);
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

  copyTemplateBody(template: EmailTemplate) {
    this.entity.body = template.body;

    this.editorBodySubject.next(template.body);
  }

}
