import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Campaign} from '../../../../shared/models/campaign.model';
import {Modes} from '../../../abstract-entity-view.component';

@Component({
  selector: 'campaign-add-new',
  templateUrl: './campaign-add-new.component.html',
  styleUrls: ['./campaign-add-new.component.scss']
})
export class CampaignAddNewComponent implements OnInit {

  @Input() mode: Modes;
  @Input() entity: Campaign;

  @Output() save: EventEmitter<Campaign> = new EventEmitter();
  @Output() changeMode: EventEmitter<Modes> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;

  constructor() { }

  ngOnInit() { }

  saveCampaign() {
    this.formInvalid = !this.entity.name;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

}
