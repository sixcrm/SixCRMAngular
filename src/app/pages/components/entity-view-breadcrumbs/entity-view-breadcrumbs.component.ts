import {Component, OnInit, Input} from '@angular/core';

export interface BreadcrumbItem {
  label: (any) => string;
  url?: string
  noTranslate?: boolean;
}

@Component({
  selector: 'entity-view-breadcrumbs',
  templateUrl: './entity-view-breadcrumbs.component.html',
  styleUrls: ['./entity-view-breadcrumbs.component.scss']
})
export class EntityViewBreadcrumbsComponent implements OnInit {

  @Input() items: BreadcrumbItem[] = [];

  constructor() { }

  ngOnInit() {
  }

}
