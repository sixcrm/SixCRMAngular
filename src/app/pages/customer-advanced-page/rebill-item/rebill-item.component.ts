import {Component, Input, OnInit } from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'rebill-item',
  templateUrl: './rebill-item.component.html',
  styleUrls: ['./rebill-item.component.scss']
})
export class RebillItemComponent implements OnInit {

  @Input() rebill: Rebill;
  @Input() sessionMode: boolean;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  navigateToSession(rebill: Rebill) {
    this.router.navigate([], {relativeTo: this.route, queryParams: { session: rebill.parentSession.id }})
  }
}
