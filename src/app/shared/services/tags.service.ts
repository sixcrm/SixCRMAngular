import { Injectable } from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdSnackBar} from '@angular/material';
import {AbstractEntityService} from './abstract-entity.service';
import {Tag} from '../models/tag.model';
import {
  tagsListQuery, tagQuery, deleteTagMutation, deleteTagsMutation,
  createTagMutation, updateTagMutation
} from '../utils/queries/entities/tag.queries';

@Injectable()
export class TagsService extends AbstractEntityService<Tag>{

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new Tag(data),
      tagsListQuery,
      tagQuery,
      deleteTagMutation,
      deleteTagsMutation,
      createTagMutation,
      updateTagMutation,
      'tag',
      snackBar
    );
  }

}
