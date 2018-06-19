import {Component, OnInit, Input} from '@angular/core';
import {BreadcrumbItem} from '../models/breadcrumb-item.model';

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
