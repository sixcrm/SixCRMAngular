import { Component, OnInit } from '@angular/core';
import {AccessKey} from '../../../shared/models/access-key.model';
import {AccessKeysService} from '../../../shared/services/access-keys.service';
import {ActivatedRoute, Params} from '@angular/router';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-access-key-view',
  templateUrl: './access-key-view.component.html',
  styleUrls: ['./access-key-view.component.scss']
})
export class AccessKeyViewComponent extends AbstractEntityViewComponent<AccessKey> implements OnInit {

  private accessKey: AccessKey;

  constructor(
    private accessKeysService: AccessKeysService,
    route: ActivatedRoute,
    progressBarService: ProgressBarService
  ) {
    super(accessKeysService, route, progressBarService);
  }

  ngOnInit() {
    this.accessKeysService.entity$.subscribe((data) => {
      this.accessKey = data;
      this.progressBarService.hideTopProgressBar();
    });

    this.init();
  }

}
