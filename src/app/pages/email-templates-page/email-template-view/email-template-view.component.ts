import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {EmailTemplate} from '../../../shared/models/email-template.model';
import {EmailTemplatesService} from '../../../shared/services/email-templates.service';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../navigation/navigation.service';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';
import {SmtpProvidersService} from '../../../shared/services/smtp-providers.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Token} from './token-list/token-list.component';
import {Subject} from 'rxjs';

declare var tinymce;

@Component({
  selector: 'email-template-view',
  templateUrl: './email-template-view.component.html',
  styleUrls: ['./email-template-view.component.scss']
})
export class EmailTemplateViewComponent extends AbstractEntityViewComponent<EmailTemplate> implements OnInit, OnDestroy {

  selectedIndex: number = 0;
  addTokenSubject: Subject<Token> = new Subject();
  editorRefreshSubject: Subject<boolean> = new Subject();

  constructor(
    service: EmailTemplatesService,
    route: ActivatedRoute,
    public navigation: NavigationService,
    public smtpProviderService: SmtpProvidersService
  ) {
    super(service, route);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new EmailTemplate();
      this.entityBackup = new EmailTemplate();
      this.smtpProviderService.getEntities();
    } else {
      this.service.entity$.takeUntil(this.unsubscribe$).take(1).subscribe(() => this.smtpProviderService.getEntities());
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    if (value === 0) {
      this.editorRefreshSubject.next(true);
    }

    this.selectedIndex = value;
  }

  cancelEdit(): void {
    this.setMode(this.modes.View);
    this.entity = this.entityBackup.copy();
  }

  addToken(token: Token) {
    if (this.viewMode) return;

    this.addTokenSubject.next(token);
  }

}
