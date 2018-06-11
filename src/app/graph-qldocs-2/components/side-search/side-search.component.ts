import { Component, OnInit, Input } from '@angular/core';
import {navigateToFieldByString} from '../../utils';
import {Router} from "@angular/router";

export interface SearchItem {
  name: string;
  children: string[];
}

@Component({
  selector: 'side-search',
  templateUrl: './side-search.component.html',
  styleUrls: ['./side-search.component.scss']
})
export class SideSearchComponent implements OnInit {

  @Input() searchItems: SearchItem[];
  @Input() focused: boolean = false;
  filterString: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() { }

  nav(path: string): void {
    navigateToFieldByString(path);
  }

  navigateTo(path: string, type: string): void {
    this.router.navigate(['documentation/graph2/', type.toLowerCase(), path]);
  }
}
