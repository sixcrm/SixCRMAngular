import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'side-container',
  templateUrl: './side-container.component.html',
  styleUrls: ['./side-container.component.scss']
})
export class SideContainerComponent implements OnInit {

  @Input() example: any;
  @Input() response: any;
  @Input() fieldType: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToResponseType(): void {
    let fieldName = this.fieldType.name || this.fieldType.ofType.name || this.fieldType.ofType.ofType.name;
    this.router.navigate(['documentation/graph2/type', fieldName]);
  }
}
