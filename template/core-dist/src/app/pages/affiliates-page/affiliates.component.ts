import { Component, OnInit } from '@angular/core';
import {AffiliatesService} from "../../shared/services/affiliates.service";
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Affiliate} from '../../shared/models/affiliate.model';
import {MdDialog} from '@angular/material';

@Component({
  selector: 'affiliates',
  templateUrl: './affiliates.component.html',
  styleUrls: ['./affiliates.component.scss']
})
export class AffiliatesComponent extends AbstractEntityIndexComponent<Affiliate> implements OnInit {
  private affiliates: Affiliate[];

  constructor(private affiliatesService: AffiliatesService, router: Router, route: ActivatedRoute, dialog: MdDialog) {
    super(affiliatesService, router, route, dialog);
  }

  ngOnInit() {
    this.affiliatesService.entities$.subscribe((data) => this.affiliates = data);
    this.affiliatesService.getEntities();
  }
}
