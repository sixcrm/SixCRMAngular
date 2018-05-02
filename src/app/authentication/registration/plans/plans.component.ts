import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Plan} from '../plan.model';

@Component({
  selector: 'plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {

  @Output() planSelected: EventEmitter<Plan> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  selectBasic() {
    this.planSelected.emit({name: 'Basic', price: 30, id: '37cbb0aa-a1e9-4ad0-afe3-38f1dce31d5b'})
  }

  selectProfessional() {
    this.planSelected.emit({name: 'Professional', price: 150, id: '646c2262-95e8-433d-be99-e621f7f17c7b'})
  }

  selectPremium() {
    this.planSelected.emit({name: 'Premium', price: 2000, id: 'd4dbbe5e-0413-44f1-98fc-a154db812541'})
  }

}
