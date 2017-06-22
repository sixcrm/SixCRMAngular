import {Component, OnInit, OnDestroy} from '@angular/core';
import {SmtpProvidersService} from '../../../shared/services/smtp-providers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {SmtpProvider} from '../../../shared/models/smtp-provider.model';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'smtp-provider-view',
  templateUrl: './smtp-provider-view.component.html',
  styleUrls: ['./smtp-provider-view.component.scss']
})
export class SmtpProviderViewComponent extends AbstractEntityViewComponent<SmtpProvider> implements OnInit, OnDestroy {

  editMode: boolean;
  selectedIndex: number = 0;
  formInvalid: boolean;

  constructor(service: SmtpProvidersService,
              route: ActivatedRoute, progressBarService: ProgressBarService,
              public navigation: NavigationService,
              private router: Router
  ) {
    super(service, route, progressBarService);
  }

  ngOnInit() {
    this.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new SmtpProvider();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.formInvalid = false;
    this.cancelUpdate();
  }

  saveProvider(valid: boolean): void {
    if (!valid) {
      this.formInvalid = true;
      return;
    }

    this.formInvalid = false;
    if (this.addMode) {
      this.service.entityCreated$.take(1).subscribe(provider => {
        this.progressBarService.hideTopProgressBar();
        this.router.navigate(['smtpproviders', provider.id]);
        this.entity = provider;
        this.entityBackup = this.entity.copy();
      });
      this.saveEntity(this.entity);
    } else {
      this.service.entityUpdated$.take(1).subscribe(() => this.editMode = false);
      this.updateEntity(this.entity);
    }
  }
}
