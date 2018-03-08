import {Component, OnInit, Input, OnDestroy, ElementRef} from '@angular/core';
import {TagsService} from '../../../shared/services/tags.service';
import {MdDialog} from '@angular/material';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {PaginationService} from '../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {tagsByEntityQuery, tagsListQuery} from '../../../shared/utils/queries/entities/tag.queries';
import {Tag} from '../../../shared/models/tag.model';

@Component({
  selector: 'entity-view-tag',
  templateUrl: './entity-view-tag.component.html',
  styleUrls: ['./entity-view-tag.component.scss'],
  host: {'(document:click)': 'closeDropdown($event)'}
})
export class EntityViewTagComponent extends AbstractEntityIndexComponent<Tag> implements OnInit, OnDestroy {

  @Input() entityId: string;

  showTags: boolean;
  addTagMode: boolean;

  tag: Tag;
  tagInvalid: boolean;

  constructor(
    service: TagsService,
    auth: AuthenticationService,
    dialog: MdDialog,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute,
    private elementRef: ElementRef
  ) {
    super(service, auth, dialog, paginationService, router, activatedRoute);
  }

  ngOnInit() {
    this.viewAfterCrate = false;
    this.service.indexQuery = (limit: number, cursor: string, search: string) => tagsByEntityQuery(this.entityId, limit, cursor, search);

    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = tagsListQuery;

    this.destroy();
  }

  toggleTags() {
    this.showTags = !this.showTags;

    if (!this.showTags) {
      this.addTagMode = false;
    }
  }

  openTags() {
    setTimeout(() => this.toggleTags(), 50);
  }

  addTag() {
    this.tag = new Tag();
    this.addTagMode = true;
  }

  cancelSaveTag() {
    setTimeout(() => {
      this.addTagMode = false;
      this.tagInvalid = false;
    }, 50);
  }

  saveTag() {
    this.tagInvalid = !this.tag.key || !this.tag.value;

    if (this.tagInvalid) return;

    this.tag.entity = this.entityId;

    this.service.createEntity(this.tag);
  }

  closeDropdown(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.showTags) {
        this.toggleTags();
      }
    }
  }
}
