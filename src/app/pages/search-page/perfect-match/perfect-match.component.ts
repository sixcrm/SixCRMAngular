import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'perfect-match',
  templateUrl: './perfect-match.component.html',
  styleUrls: ['./perfect-match.component.scss']
})
export class PerfectMatchComponent implements OnInit {

  @Input() entity: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  imageSrc(): string {
    return `/assets/images/result-item-${this.entity.fields.entity_type}.svg`;
  }

  getName(): string {
    return this.entity.fields.name || this.entity.fields.alias || `${this.entity.fields.firstname}  ${this.entity.fields.lastname}`;
  }

  navigateToEntity(): void {
    this.router.navigate([`/${this.entity.fields.entity_type}s`, this.entity.id]);
  }
}
