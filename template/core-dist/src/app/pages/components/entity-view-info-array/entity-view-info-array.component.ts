import {Component, OnInit, Input, EventEmitter} from '@angular/core';
import {Output} from '@angular/core/src/metadata/directives';

@Component({
  selector: 'entity-view-info-array',
  templateUrl: './entity-view-info-array.component.html',
  styleUrls: ['./entity-view-info-array.component.scss']
})
export class EntityViewInfoArrayComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  subtitle: string;

  @Input()
  entities: any[];

  @Input()
  fields: string[];

  @Input()
  labels: string[];

  @Input()
  options: any[];

  @Input()
  optionsField: string;

  @Input()
  editable: boolean = false;

  @Output()
  select: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  remove: EventEmitter<any> = new EventEmitter<any>();

  show: boolean = true;

  constructor() { }

  ngOnInit() { }

  toggle(): void {
    this.show = !this.show;
  }

  selectOption(option: any): void {
    this.select.emit(option);
  }

  removeEntity(entity: any): void {
    this.remove.emit(entity);
  }

}
