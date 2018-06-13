import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Rebill} from '../../../shared/models/rebill.model';
import {Router} from '@angular/router';

@Component({
  selector: 'rebill-item',
  templateUrl: './rebill-item.component.html',
  styleUrls: ['./rebill-item.component.scss']
})
export class RebillItemComponent implements OnInit {

  @Input() rebill: Rebill;
  @Input() pending: boolean;

  @Output() rebillSelected: EventEmitter<Rebill> = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToWatermark(rebill: Rebill) {
    this.router.navigate(['/sessions', rebill.parentSession.id], {fragment: 'watermark'})
  }
}
