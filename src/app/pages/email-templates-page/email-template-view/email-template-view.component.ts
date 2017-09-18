import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {EmailTemplatesService} from '../../../shared/services/email-templates.service';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';
import {SmtpProvidersService} from '../../../shared/services/smtp-providers.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Token} from './token-list/token-list.component';

declare var tinymce;

@Component({
  selector: 'email-template-view',
  templateUrl: './email-template-view.component.html',
  styleUrls: ['./email-template-view.component.scss']
})
export class EmailTemplateViewComponent extends AbstractEntityViewComponent<EmailTemplate> implements OnInit, OnDestroy, AfterViewInit {

  selectedIndex: number = 0;
  editor: any;
  types: string[] = ['allorders', 'initialorders', 'recurringorder', 'recurringfulfillment', 'recurringdecline', 'cancellation', 'returntomanufacturer', 'refundvoid'];
  smtpProviderMapper = (smtp: SmtpProvider) => smtp.name;

  constructor(
    service: EmailTemplatesService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public smtpProviderService: SmtpProvidersService,
    private router: Router
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new EmailTemplate();
      this.entityBackup = new EmailTemplate();
      this.smtpProviderService.getEntities();
    } else {
      this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe(() => this.smtpProviderService.getEntities());
    }
  }

  ngOnDestroy() {
    this.destroy();

    if (this.editor) {
      this.editor.remove();
    }
  }

  ngAfterViewInit() {
    this.setEditor();
  }

  setEditor(): void {
    setTimeout(() => {
      if (this.editor) {
        this.editor.remove();
      }

      tinymce.init({
        branding: false,
        height: 350,
        selector: '#editor-id',
        plugins: ['link', 'code', 'preview'],
        skin_url: '/assets/lightgray',
        setup: editor => {
          this.editor = editor;
          editor.on('init', e => e.target.setContent(this.entity.body));
        },
      })
    }, 800);
  }

  enableEditMode(): void {
    this.setMode(this.modes.Update)
  }

  saveTemplate(): void {
    if (this.editor) {
      this.entity.body = this.editor.getContent();
    }

    if (this.addMode) {
      this.service.entityCreated$.take(1).subscribe(entity => {
        if (entity instanceof CustomServerError) {
          this.router.navigate(['/error']);
          return;
        }

        this.router.navigate(['/emailtemplates', entity.id]);
        this.addMode = false;
        this.entity = entity;
        this.entityBackup = this.entity.copy();
      });

      this.saveEntity(this.entity);
    } else {
      this.setMode(this.modes.View);
      this.updateEntity(this.entity);
    }
  }

  setIndex(value: number): void {
    if (value === 0) {
      this.setEditor();
    }

    this.selectedIndex = value;
  }

  cancelEdit(): void {
    this.setMode(this.modes.View);
    this.entity = this.entityBackup.copy();
  }

  canBeDeactivated(): boolean {
    if (this.editor) {
      this.entity.body = this.editor.getContent();
    }

    return super.canBeDeactivated();
  }

  addToken(token: Token) {
    if (this.viewMode) return;
    this.editor.execCommand('mceInsertContent', false, ` {{${token.path.toLowerCase()}}}`);
  }

}
