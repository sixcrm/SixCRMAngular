import {Component, OnInit, OnDestroy} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {RebillsService} from '../../../shared/services/rebills.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'rebill-view',
  templateUrl: './rebill-view.component.html',
  styleUrls: ['./rebill-view.component.scss']
})
export class RebillViewComponent extends AbstractEntityViewComponent<Rebill> implements OnInit, OnDestroy {

  constructor(
    service: RebillsService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService,
    public navigation: NavigationService
  ) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
