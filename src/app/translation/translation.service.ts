import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {UserSettingsService} from '../shared/services/user-settings.service';
import {CustomServerError} from '../shared/models/errors/custom-server-error';

const EN = require('./translations/en.json');
const FR = require('./translations/fr.json');

@Injectable()
export class TranslationService {

  private translations;
  public translationChanged$: Subject<boolean> = new Subject();

  constructor(private userSettingsService: UserSettingsService) {
    this.updateTranslation();

    this.userSettingsService.entity$.merge(this.userSettingsService.entityUpdated$).subscribe(userSettings => {
      if (userSettings instanceof CustomServerError) {
        return;
      }

      this.updateTranslation(userSettings.language);
    })
  }

  updateTranslation(language?: string) {

    switch (language) {
      case 'French': {
        this.translations = FR;
        break;
      }
      default: {
        this.translations = EN;
        break;
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
