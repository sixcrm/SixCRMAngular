import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'spe-loader-breadcrumb',
  templateUrl: './spe-loader-breadcrumb.component.html',
  styleUrls: ['./spe-loader-breadcrumb.component.scss']
})
export class SpeLoaderHeaderBreadcrumbComponent implements OnInit {

  @Input() title: string;
  @Input() showBreadcrumb: string;

  constructor() { }

  ngOnInit() {
  }

}
