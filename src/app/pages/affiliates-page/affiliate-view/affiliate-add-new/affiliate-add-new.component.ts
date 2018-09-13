import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Affiliate} from '../../../../shared/models/affiliate.model';
import {Modes} from "../../../abstract-entity-view.component";

@Component({
  selector: 'affiliate-add-new',
  templateUrl: './affiliate-add-new.component.html',
  styleUrls: ['./affiliate-add-new.component.scss'],
  host: {'(document:keydown)':'onKeyDown($event)'}
})
export class AffiliateAddNewComponent implements OnInit {

  @Input() entity: Affiliate;
  @Input() displayInView: boolean = false;
  @Input() mode: Modes;

  @Output() save: EventEmitter<Affiliate> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;

  constructor() { }

  ngOnInit() {
  }

  saveAffiliate() {
    this.formInvalid = !this.entity.affiliateId;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

  onKeyDown(key) {
    if (key && key.key === 'Escape') {
      this.cancel.emit(true);
    }
  }
}
