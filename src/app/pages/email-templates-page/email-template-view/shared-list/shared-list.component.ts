import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {EmailTemplate} from '../../../../shared/models/email-template.model';
import {Subscription} from 'rxjs';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {EmailTemplatesSharedService} from '../../../../entity-services/services/email-templates-shared.service';

@Component({
  selector: 'shared-list',
  templateUrl: './shared-list.component.html',
  styleUrls: ['./shared-list.component.scss']
})
export class SharedListComponent implements OnInit, OnDestroy {

  @Output() templateSelected: EventEmitter<EmailTemplate> = new EventEmitter();

  templates: EmailTemplate[];
  sub: Subscription;
  filterString: string;
  selectedType: string;
  types: string[] = [];

  constructor(private sharedService: EmailTemplatesSharedService) { }

  ngOnInit() {
    this.sub = this.sharedService.entities$.subscribe(templates => {
      if (templates instanceof CustomServerError) return;

      this.templates = templates;
      this.types = this.templates.map(t => t.type);
    });

    this.sharedService.resetPagination();
    this.sharedService.getEntities();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
