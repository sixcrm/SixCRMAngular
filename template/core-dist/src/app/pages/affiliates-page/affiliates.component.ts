import { Component, OnInit } from '@angular/core';
import {AffiliatesService} from "../../shared/services/affiliates.service";

@Component({
  selector: 'affiliates',
  templateUrl: './affiliates.component.html',
  styleUrls: ['./affiliates.component.scss']
})
export class AffiliatesComponent implements OnInit {

  constructor(private affiliatesService: AffiliatesService) { }

  ngOnInit() {
  }

}
