import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Campaign} from '../../../../shared/models/campaign.model';
import {Modes} from '../../../abstract-entity-view.component';
import {LoadBalancer} from '../../../../shared/models/load-balancer.model';
import {LoadBalancersService} from '../../../../shared/services/load-balancers.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {LoadBalancerAssociation} from '../../../../shared/models/load-balancer-association.model';

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

  loadBalancers: LoadBalancer[] = [];
  loadBalancerMapper = (loadBalancer: LoadBalancer) => loadBalancer ? loadBalancer.name : null;

  modes = Modes;
  formInvalid: boolean;

  constructor(private loadBalancersService: LoadBalancersService) { }

  ngOnInit() {
    this.loadBalancersService.entities$.take(1).subscribe((data) => {
      if (data instanceof CustomServerError) return;

      this.loadBalancers = data.slice();
    });

    this.loadBalancersService.getEntities();
  }

  saveCampaign() {
    this.formInvalid = !this.entity.name;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

  setAssociatedLoadBalancer(loadBalancer: LoadBalancer) {
    this.entity.loadbalancerAssociations = this.entity.loadbalancerAssociations.filter(a => a.id).map(a => {
      a.loadbalancer = new LoadBalancer();

      return a;
    });

    this.entity.loadbalancerAssociations.push(new LoadBalancerAssociation({loadbalancer: loadBalancer}));
  }

  removeAssociations() {
    if (this.mode === Modes.View) return;

    this.entity.loadbalancerAssociations = this.entity.loadbalancerAssociations.filter(a => a.id);

    if (!this.entity.loadbalancerAssociations || !this.entity.loadbalancerAssociations[0]) return;

    this.entity.loadbalancerAssociations[0].loadbalancer = new LoadBalancer();
  }
}
