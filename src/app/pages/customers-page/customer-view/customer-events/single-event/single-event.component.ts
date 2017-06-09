import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'single-event',
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.scss']
})
export class SingleEventComponent implements OnInit {

  @Input() data: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateTo(data: any): void {
    if (!data || !data.id || !data.type) return;

    this.router.navigate([data.type + 's', data.id]);
  }

}
