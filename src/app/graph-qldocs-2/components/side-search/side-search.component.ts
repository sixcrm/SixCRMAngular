import { Component, OnInit, Input } from '@angular/core';
import {navigateToFieldByString} from '../../utils';
import {Router} from "@angular/router";
import {GraphqlDocs2Service} from "../../graphql-docs-2.service";

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

  constructor(
    private router: Router,
    private docsService: GraphqlDocs2Service
  ) { }

  ngOnInit() { }

  nav(path: string): void {
    navigateToFieldByString(path);
  }

  navigateTo(path: string, type: string): void {
    this.router.navigate(['documentation/graph2/', type.toLowerCase(), path]);
  }

  get selectedItem(): string {
    return this.docsService.selectedItem;
  }

  set selectedItem(item: string) {
    this.docsService.selectedItem = item;
  }

  get filterString(): string {
    return this.docsService.filterString;
  }

  set filterString(filter: string) {
    this.docsService.filterString = filter;
  }
}
