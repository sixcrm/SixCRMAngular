import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Campaign} from '../../../../shared/models/campaign.model';
import {Modes} from '../../../abstract-entity-view.component';
import {MerchantProviderGroup} from '../../../../shared/models/merchant-provider-group.model';
import {MerchantProviderGroupsService} from '../../../../entity-services/services/merchant-provider-groups.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {MerchantProviderGroupAssociation} from '../../../../shared/models/merchant-provider-group-association.model';

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

  merchantProviderGroups: MerchantProviderGroup[] = [];
  merchantProviderGroupMapper = (merchantProviderGroup: MerchantProviderGroup) => merchantProviderGroup ? merchantProviderGroup.name : null;

  modes = Modes;
  formInvalid: boolean;

  constructor(private merchantProviderGroupsService: MerchantProviderGroupsService) { }

  ngOnInit() {
    this.merchantProviderGroupsService.entities$.take(1).subscribe((data) => {
      if (data instanceof CustomServerError) return;

      this.merchantProviderGroups = data.slice();
    });

    this.merchantProviderGroupsService.getEntities();
  }

  saveCampaign() {
    this.formInvalid = !this.entity.name;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

  setAssociatedMerchantProviderGroup(merchantProviderGroup: MerchantProviderGroup) {
    this.entity.merchantProviderGroupAssociations = this.entity.merchantProviderGroupAssociations.filter(a => a.id).map(a => {
      a.merchantProviderGroup = new MerchantProviderGroup();

      return a;
    });

    this.entity.merchantProviderGroupAssociations.push(new MerchantProviderGroupAssociation({merchantprovidergroup: merchantProviderGroup}));
  }

  removeAssociations() {
    if (this.mode === Modes.View) return;

    this.entity.merchantProviderGroupAssociations = this.entity.merchantProviderGroupAssociations.filter(a => a.id);

    if (!this.entity.merchantProviderGroupAssociations || !this.entity.merchantProviderGroupAssociations[0]) return;

    this.entity.merchantProviderGroupAssociations[0].merchantProviderGroup = new MerchantProviderGroup();
  }
}
