import {Component, OnInit, Input} from '@angular/core';
import {NavigationService} from '../../../navigation/navigation.service';
import {BreadcrumbItem} from '../models/breadcrumb-item.model';
import {Router} from '@angular/router';

@Component({
  selector: 'blue-header',
  templateUrl: './blue-header.component.html',
  styleUrls: ['./blue-header.component.scss']
})
export class BlueHeaderComponent implements OnInit {

  @Input() items: BreadcrumbItem[] = [];
  @Input() titleValue: string;

  constructor(public navigationService: NavigationService, private router: Router) { }

  ngOnInit() { }

  navigateTo(item: BreadcrumbItem) {
    if (item.url) {
      this.router.navigateByUrl(item.url);
    }
  }

}
