import { Component, OnInit, Input } from '@angular/core';
import {SearchService} from '../../../shared/services/search.service';

@Component({
  selector: 'entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss']
})
export class EntityListComponent implements OnInit {

  @Input() query: string;
  @Input() data: any[] = [];
  @Input() entityType: string;
  @Input() found: number;

  constructor(private searchService: SearchService) { }

  ngOnInit() {
  }
}
