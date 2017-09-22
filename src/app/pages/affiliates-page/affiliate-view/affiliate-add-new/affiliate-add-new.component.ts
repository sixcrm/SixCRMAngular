import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Affiliate} from '../../../../shared/models/affiliate.model';

@Component({
  selector: 'affiliate-add-new',
  templateUrl: './affiliate-add-new.component.html',
  styleUrls: ['./affiliate-add-new.component.scss']
})
export class AffiliateAddNewComponent implements OnInit {

  @Input() entity: Affiliate;

  @Output() save: EventEmitter<Affiliate> = new EventEmitter();

  formInvalid: boolean;

  constructor() { }

  ngOnInit() {
  }

  saveAffiliate() {
    this.formInvalid = !this.entity.name || !this.entity.affiliateId;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }
}
