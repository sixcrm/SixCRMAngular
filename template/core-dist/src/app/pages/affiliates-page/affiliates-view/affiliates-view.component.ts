import { Component, OnInit } from '@angular/core';
import {Affiliate} from '../../../shared/models/affiliate.model';
import {AffiliatesService} from '../../../shared/services/affiliates.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'c-affiliates-view',
  templateUrl: './affiliates-view.component.html',
  styleUrls: ['./affiliates-view.component.scss']
})
export class AffiliatesViewComponent implements OnInit {
  private affiliate: Affiliate;

  constructor(private affiliatesService: AffiliatesService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.affiliatesService.entity$.subscribe((data) => this.affiliate = data);
    this.route.params.subscribe((params) => this.affiliatesService.getEntity(params['id']));
  }
}
