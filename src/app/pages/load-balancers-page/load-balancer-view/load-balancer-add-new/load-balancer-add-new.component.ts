import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {LoadBalancer} from '../../../../shared/models/load-balancer.model';
import {Modes} from '../../../abstract-entity-view.component';

@Component({
  selector: 'load-balancer-add-new',
  templateUrl: './load-balancer-add-new.component.html',
  styleUrls: ['./load-balancer-add-new.component.scss']
})
export class LoadBalancerAddNewComponent implements OnInit {

  @Input() entity: LoadBalancer;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() save: EventEmitter<LoadBalancer> = new EventEmitter();

  modes = Modes;
  formInvalid: boolean;

  constructor() { }

  ngOnInit() { }

  saveLoadBalancer(): void {
    this.formInvalid = !this.entity.name;
    if (this.formInvalid) return;

    this.save.emit(this.entity);
  }

}
