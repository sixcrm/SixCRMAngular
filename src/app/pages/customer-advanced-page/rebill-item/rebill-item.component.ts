import {Component, Input, OnInit } from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {Router} from '@angular/router';

@Component({
  selector: 'rebill-item',
  templateUrl: './rebill-item.component.html',
  styleUrls: ['./rebill-item.component.scss']
})
export class RebillItemComponent implements OnInit {

  @Input() rebill: Rebill;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToWatermark(rebill: Rebill) {
    this.router.navigate(['/sessions', rebill.parentSession.id], {fragment: 'watermark'})
  }
}
