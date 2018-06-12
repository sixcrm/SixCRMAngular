import {Component, Input, OnInit} from '@angular/core';
import {NavigationService} from '../../../navigation/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'graphql-header',
  templateUrl: './graphql-header.component.html',
  styleUrls: ['./graphql-header.component.scss']
})
export class GraphqlHeaderComponent implements OnInit {

  @Input() path: string[];

  constructor(
    private router: Router,
    public navigationService: NavigationService
  ) { }

  ngOnInit() { }

  navigateToHome() {
    this.router.navigate(['/dashboard']);
  }

  navigateToGraph() {
    this.router.navigate(['/documentation/graph2']);
  }
}
