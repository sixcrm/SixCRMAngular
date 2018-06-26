import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {AbstractEntityService} from '../../../entity-services/services/abstract-entity.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {FeatureFlagService} from '../../../shared/services/feature-flag.service';

@Component({
  selector: 'entities-table-wrapper',
  templateUrl: './entities-table-wrapper.component.html',
  styleUrls: ['./entities-table-wrapper.component.scss']
})
export class EntitiesTableWrapperComponent implements OnInit {

  @Input() columnParams: ColumnParams<any>[] = [];
  @Input() data: any[] = [];
  @Input() loaded: boolean = true;
  @Input() filterString: string;
  @Input() serverError: CustomServerError;
  @Input() customOptionText: string;
  @Output() selected: EventEmitter<any> = new EventEmitter();

  // actions
  @Input() service: AbstractEntityService<any>;

  @Input() showView: boolean = true;
  @Input() showDelete: boolean = true;
  @Input() showCopy: boolean;
  @Input() dedicatedOptions: boolean = true;

  @Output() viewClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() copyClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() exportClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteManyClicked: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() editClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() refreshData: EventEmitter<any> = new EventEmitter<any>();
  @Output() customOptionClicked: EventEmitter<any> = new EventEmitter<any>();

  // pagination
  @Input() limit: number;
  @Input() paginationValues: number[];
  @Input() nextDisabled: boolean;
  @Input() previousDisabled: boolean;
  @Input() paginationString: string;
  @Output() next: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() previous: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updateLimit: EventEmitter<number> = new EventEmitter<number>();

  @Output() filterChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchChanged: EventEmitter<string> = new EventEmitter<string>();


  constructor(public featuresFlagService: FeatureFlagService) { }

  ngOnInit() {
  }

}
