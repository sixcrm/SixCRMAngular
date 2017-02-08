import {ActivatedRoute, Params} from '@angular/router';
import {AbstractEntityService} from '../shared/services/abstract-entity.service';

export abstract class AbstractEntityViewComponent<T> {

  protected addMode: boolean = false;
  protected viewMode: boolean = false;
  protected updateMode: boolean = false;

  constructor(private service: AbstractEntityService<T>, private route: ActivatedRoute) {
    this.route.params.subscribe((params: Params) => {
      if (params['type'] === 'view') {
        this.viewMode = true;
        this.service.getEntity(params['id']);
      }

      if (params['type'] === 'add') {
        this.addMode = true;
      }

      if (params['type'] == 'update') {
        this.updateMode = true;
      }
    });
  }
}
