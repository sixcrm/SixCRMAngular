import {Component, OnInit} from '@angular/core';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';

@Component({
  selector: 'roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit{

  tabHeaders: TabHeaderElement[] = [
    {name: 'shared', label: 'ROLE_TAB_SHARED'},
    {name: 'custom', label: 'ROLE_TAB_CUSTOM'}
  ];

  selectedIndex: number = 0;

  constructor() {}

  ngOnInit() {}

  setIndex(value: number) {
    this.selectedIndex = value;
  }

}
