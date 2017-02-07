import { Component, OnInit } from '@angular/core';
import {AccessKey} from '../../../shared/models/access-key.model';
import {AccessKeysService} from '../../../shared/services/access-keys.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'c-access-key-view',
  templateUrl: './access-key-view.component.html',
  styleUrls: ['./access-key-view.component.scss']
})
export class AccessKeyViewComponent implements OnInit {

  private accessKey: AccessKey;

  constructor(private accessKeysService: AccessKeysService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.accessKeysService.entity$.subscribe((data) => this.accessKey = data);
    this.route.params.subscribe((params: Params) => this.accessKeysService.getEntity(params['id']))
  }

}
