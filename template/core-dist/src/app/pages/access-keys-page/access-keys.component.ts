import { Component, OnInit } from '@angular/core';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {AccessKeysService} from '../../shared/services/access-keys.service';
import {Router, ActivatedRoute} from '@angular/router';
import {AccessKey} from '../../shared/models/access-key.model';

@Component({
  selector: 'c-access-keys',
  templateUrl: './access-keys.component.html',
  styleUrls: ['./access-keys.component.scss']
})
export class AccessKeysComponent extends AbstractEntityIndexComponent implements OnInit {

  private accessKeys: AccessKey[];

  constructor(private accessKeysService: AccessKeysService, router: Router, route: ActivatedRoute) {
    super(accessKeysService, router, route);
  }

  ngOnInit() {
    this.accessKeysService.entities$.subscribe((data) => this.accessKeys = data);
    this.accessKeysService.getEntities();
  }

}
