import {ActivatedRoute, Router} from '@angular/router';
import {AbstractEntityService} from '../shared/services/abstract-entity.service';

export abstract class AbstractEntityIndexComponent {

  constructor(private service: AbstractEntityService<any>, private router: Router, private route: ActivatedRoute) {}

  viewEntity(id: string): void {
    this.router.navigate([id], { relativeTo: this.route});
  }

  editEntity(entity: any): void {
    this.service.editEntity(entity);
  }

  deleteEntity(id: string): void {
    this.service.deleteEntity(id);
  }
}
