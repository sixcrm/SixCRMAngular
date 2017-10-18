import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {AccessKey} from '../../../shared/models/access-key.model';
import {AccessKeysService} from '../../../shared/services/access-keys.service';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'access-keys-view',
  templateUrl: './access-keys-view.component.html',
  styleUrls: ['./access-keys-view.component.scss']
})
export class AccessKeysViewComponent extends AbstractEntityViewComponent<AccessKey> implements OnInit, OnDestroy {

  selectedIndex: number = 0;

  constructor(accessKeysService: AccessKeysService,
              route: ActivatedRoute,
              public navigation: NavigationService
  ) {
    super(accessKeysService, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }

}
