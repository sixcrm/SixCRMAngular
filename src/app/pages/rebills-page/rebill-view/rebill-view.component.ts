import {Component, OnInit, OnDestroy} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {RebillsService} from '../../../shared/services/rebills.service';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'rebill-view',
  templateUrl: './rebill-view.component.html',
  styleUrls: ['./rebill-view.component.scss']
})
export class RebillViewComponent extends AbstractEntityViewComponent<Rebill> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  billdate: string = 'asdf';
  billamount: string = 'bbb';
  parentsession: string = 'ccc';

  constructor(
    service: RebillsService,
    route: ActivatedRoute,
    public navigation: NavigationService
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init();

    this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe(entity => {
      this.billdate = entity.billAt.format('MM/DD/YYYY');
      this.billamount = entity.amount.usd();
      this.parentsession = entity.parentSession.id;
    })
  }

  ngOnDestroy() {
    this.destroy();
  }
}
