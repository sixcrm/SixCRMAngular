import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'features-header',
  templateUrl: './features-header.component.html',
  styleUrls: ['./features-header.component.scss']
})
export class FeaturesHeaderComponent implements OnInit {

  @Input() path: string[];

  constructor(
    private router: Router
  ) { }

  ngOnInit() { }

  navigateToHome() {
    this.router.navigate(['/dashboard']);
  }
}
