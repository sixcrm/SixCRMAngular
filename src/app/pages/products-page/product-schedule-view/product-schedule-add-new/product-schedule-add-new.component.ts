import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ProductSchedule} from '../../../../shared/models/product-schedule.model';
import {Modes} from '../../../abstract-entity-view.component';
import {SmsProvider} from '../../../../shared/models/sms-provider.model';
import {Router} from '@angular/router';
import {SmsProvidersService} from '../../../../entity-services/services/sms-providers.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'product-schedule-add-new',
  templateUrl: 'product-schedule-add-new.component.html',
  styleUrls: ['product-schedule-add-new.component.scss'],
  host: {'(document:keydown)':'onKeyDown($event)'}
})
export class ProductScheduleAddNewComponent implements OnInit {

  @Input() entity: ProductSchedule;
  @Input() mode: Modes;

  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();
  @Output() save: EventEmitter<ProductSchedule> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();

  add = Modes.Add;
  update = Modes.Update;
  view = Modes.View;

  formInvalid: boolean;

  smsProviderMapper = (e: SmsProvider) => e && e.name || undefined;
  smsProviders: SmsProvider[] = [];

  constructor(
    public smsProvidersService: SmsProvidersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.smsProvidersService.entities$.take(1).subscribe(providers => {
      if (providers instanceof CustomServerError) return;

      this.smsProviders = providers;
    });

    this.smsProvidersService.getEntities();
  }

  saveSchedule(valid: boolean) {
    this.formInvalid = !valid;
    if (this.formInvalid) return;

    this.save.emit(this.entity)
  }


  onKeyDown(key) {
    if (key && key.key === 'Escape') {
      this.cancel.emit(true);
    }
  }

  navigateToNewSmsProvider() {
    this.router.navigate(['/smsproviders'], {queryParams: {action: 'new'}})
  }
}
