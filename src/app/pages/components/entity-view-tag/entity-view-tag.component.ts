import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {TagsService} from '../../../shared/services/tags.service';
import {MdDialog} from '@angular/material';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {PaginationService} from '../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {tagsByEntityQuery, tagsListQuery} from '../../../shared/utils/queries/entities/tag.queries';
import {Tag} from '../../../shared/models/tag.model';
import {TableMemoryTextOptions} from '../table-memory/table-memory.component';
import {ColumnParams, ColumnParamsInputType} from '../../../shared/models/column-params.model';
import {IndexQueryParameters} from '../../../shared/utils/queries/index-query-parameters.model';

@Component({
  selector: 'entity-view-tag',
  templateUrl: './entity-view-tag.component.html',
  styleUrls: ['./entity-view-tag.component.scss']
})
export class EntityViewTagComponent extends AbstractEntityIndexComponent<Tag> implements OnInit, OnDestroy {

  @Input() entityId: string;

  showTags: boolean;

  tagParams: ColumnParams<Tag>[] = [];
  tagTextOptions: TableMemoryTextOptions = {
    title: '',
    noDataText: 'SINGLEPAGE_TAG_NODATA',
    disassociateOptionText: 'SINGLEPAGE_TAG_DELETE',
    editOptionText: 'SINGLEPAGE_TAG_EDIT'
  };

  tagFactory = () => new Tag();

  allTags: Tag[] = [];

  constructor(
    service: TagsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(service, auth, dialog, paginationService, router, activatedRoute);

    this.allEntities.takeUntil(this.unsubscribe$).subscribe(tags => {
      if (tags) {
        this.allTags = tags.slice();
      }
    });
  }

  ngOnInit() {
    this.viewAfterCrate = false;
    this.service.indexQuery = (params: IndexQueryParameters) => tagsByEntityQuery(this.entityId, {limit: null, cursor: null, search: params.search});

    this.tagParams = [
      new ColumnParams<Tag>('SINGLEPAGE_TAG_KEY')
        .setMappingFunction((e: Tag) => e.key)
        .setAssigningFunction((e: Tag, value: string) => {
          e.key = value;
          return e;
        })
        .setValidator((e: Tag) => !!e.key)
        .setInputType(ColumnParamsInputType.STRING)
        .setAutofocus(true),
      new ColumnParams<Tag>('SINGLEPAGE_TAG_VALUE')
        .setMappingFunction((e: Tag) => e.value)
        .setAssigningFunction((e: Tag, value: string) => {
          e.value = value;
          return e;
        })
        .setValidator((e: Tag) => !!e.value)
        .setInputType(ColumnParamsInputType.STRING)
        .setAutofocus(true)
    ];

    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = tagsListQuery;

    this.destroy();
  }

  overlayClicked(event: any): void {
    if (event && event.target && event.target.className === 'tag-modal-container') {
      this.showTags = false;
      this.allTags = this.allTags.map(e => e.copy());
    }
  }

  openTags() {
    this.showTags = true;
  }

  addTag(tag: Tag) {
    tag.entity = this.entityId;

    this.service.createEntity(tag);
  }

  updateTag(tag: Tag) {
    this.service.updateEntity(tag);
  }

  deleteTag(tag: Tag) {
    this.service.deleteEntity(tag.id);
  }

  deleteTags(tags: Tag[]) {
    this.service.deleteEntities(tags.map(t => t.id));
  }
}
