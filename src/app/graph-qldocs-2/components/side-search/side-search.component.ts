import { Component, OnInit, Input } from '@angular/core';
import {navigateToFieldByString} from '../../utils';

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

  constructor() { }

  ngOnInit() { }

  nav(path: string): void {
    navigateToFieldByString(path);
  }
}
