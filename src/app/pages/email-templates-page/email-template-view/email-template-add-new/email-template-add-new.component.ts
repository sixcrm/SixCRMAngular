import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {EmailTemplate} from '../../../../shared/models/email-template.model';
import {Modes} from '../../../abstract-entity-view.component';
import {SmtpProvider} from '../../../../shared/models/smtp-provider.model';
import {SmtpProvidersService} from '../../../../entity-services/services/smtp-providers.service';

@Component({
  selector: 'email-template-add-new',
  templateUrl: './email-template-add-new.component.html',
  styleUrls: ['./email-template-add-new.component.scss'],
  host: {'(document:keydown)':'onKeyDown($event)'}
})
export class EmailTemplateAddNewComponent implements OnInit {

  @Input() entity: EmailTemplate;
  @Input() mode: Modes;

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
  smtpProviders: any = [null];

  constructor(public smtpProviderService: SmtpProvidersService) { }

  ngOnInit() {
    this.smtpProviderService.entities$.take(1).subscribe((providers) => {
      this.smtpProviders = providers;
    });

    this.smtpProviderService.getEntities();
  }

  saveEmailTemplate(valid: boolean): void {
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
