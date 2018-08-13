import {Component, OnInit, EventEmitter, Input, Output, AfterViewInit, OnDestroy} from '@angular/core';
import {EmailTemplate} from '../../../../shared/models/email-template.model';
import {Modes} from '../../../abstract-entity-view.component';
import {SmtpProvider} from '../../../../shared/models/smtp-provider.model';
import {SmtpProvidersService} from '../../../../entity-services/services/smtp-providers.service';
import {Token} from '../token-list/token-list.component';
import {Subject, Subscription} from 'rxjs';
import {CustomServerError} from "../../../../shared/models/errors/custom-server-error";

declare var tinymce;

@Component({
  selector: 'email-template-add-new',
  templateUrl: './email-template-add-new.component.html',
  styleUrls: ['./email-template-add-new.component.scss'],
  host: {'(document:keydown)':'onKeyDown($event)'}
})
export class EmailTemplateAddNewComponent implements OnInit, AfterViewInit, OnDestroy {

  _tokenSubscription: Subscription;
  _refreshSubscription: Subscription;
  _bodySubscription: Subscription;

  @Input() entity: EmailTemplate;
  @Input() mode: Modes;
  @Input() set tokenSubject(subject: Subject<Token>) {
    if (!this._tokenSubscription) {

      this._tokenSubscription = subject.subscribe(token =>{
        if (this.editor) {
          this.editor.execCommand('mceInsertContent', false, `{{${token.value.toLowerCase()}}}`);
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

  @Input() set editorBodySubject(subject: Subject<string>) {
    if (!this._bodySubscription) {

      this._bodySubscription = subject.subscribe(body =>{
        if (this.editor) {
          this.editor.setContent(body)
        }
      })

    }
  }

  @Input() editEnabled: boolean = true;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<EmailTemplate> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;

  types: string[] = [ 'initialorders', 'allorders', 'initialfulfillment', 'allfulfillments', 'delivery', 'cancellation', 'return', 'refund', 'decline' ];

  typeMapper = (type) => {
    switch (type) {
      case 'initialorders': return 'Initial Order';
      case 'allorders': return 'All Orders';
      case 'initialfulfillment': return 'Initial Fulfillment';
      case 'allfulfillments': return 'All Fulfillments';
      case 'delivery': return 'Delivery';
      case 'cancellation': return 'Order Cancellation';
      case 'return': return 'Return';
      case 'refund': return 'Refund';
      case 'decline': return 'All Declines';
    }

    return ''
  };

  smtpProviderMapper = (smtp: SmtpProvider) => smtp.name;

  editor: any;
  smtpProviders: any = [null];

  constructor(public smtpProviderService: SmtpProvidersService) { }

  ngOnInit() {
    this.smtpProviderService.entities$.take(1).subscribe((providers) => {
      this.smtpProviders = providers;
    });

    this.smtpProviderService.getEntities();
  }

  ngOnDestroy() {
    if (this._tokenSubscription) {
      this._tokenSubscription.unsubscribe();
    }

    if (this._refreshSubscription) {
      this._refreshSubscription.unsubscribe();
    }

    if (this._bodySubscription) {
      this._bodySubscription.unsubscribe();
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

    this.formInvalid = !valid || !this.entity.smtpProvider.id || !this.entity.type;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

  cancelUpdate() {
    this.cancel.emit(true)
  }

  onKeyDown(key) {
    if (key && key.key === 'Escape') {
      this.cancel.emit(true);
    }
  }
}
