import {Component, OnInit, EventEmitter, Input, Output, AfterViewInit, OnDestroy} from '@angular/core';
import {EmailTemplate} from '../../../../shared/models/email-template.model';
import {Modes} from '../../../abstract-entity-view.component';
import {SmtpProvider} from '../../../../shared/models/smtp-provider.model';
import {SmtpProvidersService} from '../../../../shared/services/smtp-providers.service';
import {Token} from '../token-list/token-list.component';
import {Subject, Subscription} from 'rxjs';
import {EmailTemplatesSharedService} from '../../../../shared/services/email-templates-shared.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';

declare var tinymce;

@Component({
  selector: 'email-template-add-new',
  templateUrl: './email-template-add-new.component.html',
  styleUrls: ['./email-template-add-new.component.scss']
})
export class EmailTemplateAddNewComponent implements OnInit, AfterViewInit, OnDestroy {

  _tokenSubscription: Subscription;
  _refreshSubscription: Subscription;

  @Input() entity: EmailTemplate;
  @Input() mode: Modes;
  @Input() set tokenSubject(subject: Subject<Token>) {
    if (!this._tokenSubscription) {

      this._tokenSubscription = subject.subscribe(token =>{
        if (this.editor) {
          this.editor.execCommand('mceInsertContent', false, `{{${token.path.toLowerCase()}}}`);
        }
      })

    }
  }
  @Input() set editorRefreshSubject(subject: Subject<boolean>) {
    if (!this._refreshSubscription) {

      this._refreshSubscription = subject.subscribe(() =>{
        this.setEditor();
      })

    }
  }

  @Input() editEnabled: boolean = true;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<EmailTemplate> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;

  types: string[] = ['allorders', 'initialorders', 'recurringorder', 'recurringfulfillment', 'recurringdecline', 'cancellation', 'returntomanufacturer', 'refundvoid'];
  smtpProviderMapper = (smtp: SmtpProvider) => smtp.name;

  editor: any;
  templates: EmailTemplate[];
  templatesLoaded: boolean;

  constructor(public smtpProviderService: SmtpProvidersService, private templatesService: EmailTemplatesSharedService) { }

  ngOnInit() {
    this.templatesService.entities$.take(1).subscribe(templates => {
      if (templates instanceof CustomServerError) return;

      this.templates = templates;

      this.loadTemplates();
    });
    this.templatesService.getEntities();
    this.smtpProviderService.getEntities();
  }

  ngOnDestroy() {
    if (this._tokenSubscription) {
      this._tokenSubscription.unsubscribe();
    }

    if (this._refreshSubscription) {
      this._refreshSubscription.unsubscribe();
    }

    if (this.editor) {
      this.editor.remove();
    }
  }

  ngAfterViewInit() {
    this.setEditor();
  }

  setEditor(): void {
    if (this.mode === this.modes.Add) return;

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
        menubar: 'file edit insert view format table tools help templates',
        toolbar: 'undo redo | styleselect | bold italic | link image | templates',
        setup: editor => {
          this.editor = editor;
          editor.on('init', e => e.target.setContent(this.entity.body));

          this.loadTemplates();
        },
      })
    }, 800);
  }

  loadTemplates() {
    if (this.templatesLoaded || !this.editor || !this.templates) return;

    this.editor.addButton('templates', {
      type: 'menubutton',
      text: 'Managed Templates',
      icon: false,
      menu: this.templates.map(t => {
        return {text: t.name, onclick: () => this.editor.setContent(t.body)}
      })
    });

    this.templatesLoaded = true;
  }

  saveEmailTemplate(valid: boolean): void {
    if (this.editor) {
      this.entity.body = this.editor.getContent();
    }

    this.formInvalid = !valid || !this.entity.smtpProvider.id || !this.entity.type;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

  cancelUpdate() {
    if (this.editor && this.entity) {
      this.editor.setContent(this.entity.body);
    }
    this.cancel.emit(true)
  }
}
