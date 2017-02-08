import {ActivatedRoute, Router} from '@angular/router';
import {AbstractEntityService} from '../shared/services/abstract-entity.service';

export abstract class AbstractEntityIndexComponent<T> {

  constructor(private service: AbstractEntityService<T>, private router: Router, private route: ActivatedRoute) {}

  viewEntity(id: string): void {
    this.router.navigate(['view', id], { relativeTo: this.route});
  }

  updateEntity(id: string): void {
    this.router.navigate(['update', id], { relativeTo: this.route});
  }

  deleteEntity(id: string): void {
    this.service.deleteEntity(id);
  }

  add(): void {
    this.router.navigate(['add'], { relativeTo: this.route});
  }
}
