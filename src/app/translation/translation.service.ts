import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {UserSettingsService} from '../shared/services/user-settings.service';
import {CustomServerError} from '../shared/models/errors/custom-server-error';
import {AuthenticationService} from '../authentication/authentication.service';

const EN = require('./translations/en.json');
const FR = require('./translations/fr.json');
const DE = require('./translations/de.json');

@Injectable()
export class TranslationService {

  private translations;
  public translationChanged$: Subject<boolean> = new Subject();

  constructor(private userSettingsService: UserSettingsService, private authService: AuthenticationService) {
    this.updateTranslation();

    this.userSettingsService.entity$.merge(this.userSettingsService.entityUpdated$).subscribe(userSettings => {
      if (userSettings instanceof CustomServerError) {
        return;
      }

      this.updateTranslation(userSettings.language);
    });

    this.authService.userSettings$.subscribe(userSettings => {

      if (userSettings && userSettings.language) {
        this.updateTranslation(userSettings.language);
      }

    })
  }

  getLanguages(): string[] {
    return ['English', 'French', 'German'];
  }

  updateTranslation(language?: string) {

    switch (language) {
      case 'French': {
        this.translations = FR;
        break;
      }
      case 'German': {
        this.translations = DE;
        break;
      }
      default: {
        this.translations = EN;
      }
    }

    this.translationChanged$.next(true);
  }

  translate(value: string) {
    const keys = value.toLowerCase().split('_');

    let translation = value;

    try {
      translation = this.parseTranslation(this.translations, keys) || value;
    } catch (error) {
      // handle missing translation;
    }

    return translation;
  }

  parseTranslation(obj: any, keys: string[]): string {
    if (!keys || keys.length === 0) {

      if (!obj) return '';

      if (typeof obj === 'string') {
        return obj;
      }

      return '';
    }

    const key = keys.shift();

    return this.parseTranslation(obj[key], keys);
  }
}
