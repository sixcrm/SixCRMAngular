import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Plan} from './plan.model';

@Component({
  selector: 'plans',
  templateUrl: 'plans.component.html',
  styleUrls: ['plans.component.scss']
})
export class PlansComponent implements OnInit {

  @Output() planSelected: EventEmitter<Plan> = new EventEmitter();

  selectedPlan: string;

  constructor() { }

  ngOnInit() {
  }

  selectBasic() {
    this.selectedPlan = 'basic';
    this.emitPlan(Plan.ofServerName(this.selectedPlan));
  }

  selectProfessional() {
    this.selectedPlan = 'pro';
    this.emitPlan(Plan.ofServerName(this.selectedPlan));
  }

  selectPremium() {
    this.selectedPlan = 'premium';
    this.emitPlan(Plan.ofServerName(this.selectedPlan));
  }

  emitPlan(plan: Plan) {
    setTimeout(() => {
      this.planSelected.emit(plan);
    }, 1000);
  }

}
