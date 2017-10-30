import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'search-loader',
  templateUrl: './search-loader.component.html',
  styleUrls: ['./search-loader.component.scss']
})
export class SearchLoaderComponent implements OnInit {

  items = [];

  constructor() { }

  ngOnInit() {
    this.items = Array(3);
  }

}
