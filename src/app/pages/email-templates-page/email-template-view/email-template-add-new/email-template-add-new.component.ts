import {Component, OnInit, EventEmitter, Input, Output, AfterViewInit, OnDestroy} from '@angular/core';
import {EmailTemplate} from '../../../../shared/models/email-template.model';
import {Modes} from '../../../abstract-entity-view.component';
import {SmtpProvider} from '../../../../shared/models/smtp-provider.model';
import {SmtpProvidersService} from '../../../../shared/services/smtp-providers.service';
import {Token} from '../token-list/token-list.component';
import {Subject, Subscription} from 'rxjs';

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

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<EmailTemplate> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;

  types: string[] = ['allorders', 'initialorders', 'recurringorder', 'recurringfulfillment', 'recurringdecline', 'cancellation', 'returntomanufacturer', 'refundvoid'];
  smtpProviderMapper = (smtp: SmtpProvider) => smtp.name;

  editor: any;

  constructor(public smtpProviderService: SmtpProvidersService) { }

  ngOnInit() {
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

  saveEmailTemplate(valid: boolean): void {
    if (this.editor) {
      this.entity.body = this.editor.getContent();
    }

    this.formInvalid = !valid || !this.entity.smtpProvider.id || !this.entity.type || !this.entity.body;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }
}
