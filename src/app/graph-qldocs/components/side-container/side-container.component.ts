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
  @Input() fieldName: string;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToResponseType(): void {
    this.router.navigate(['documentation/graph/type', this.fieldName]);
  }
}
