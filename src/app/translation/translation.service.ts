import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {UserSettingsService} from '../shared/services/user-settings.service';
import {CustomServerError} from '../shared/models/errors/custom-server-error';
import {AuthenticationService} from '../authentication/authentication.service';

const languages = require('./translations/languages.json');
const allTranslations = languages.map(l => {
  l['translations'] = require('./translations/'+l.filename);

  return l;
});

@Injectable()
export class TranslationService {

  private translations;
  private locale;
  public translationChanged$: Subject<boolean> = new Subject();

  constructor(private userSettingsService: UserSettingsService, private authService: AuthenticationService) {
    this.updateTranslation(this.authService.getUserSettings().language);

    this.authService.userSettings$.subscribe(userSettings => {

      if (userSettings && userSettings.language) {
        this.updateTranslation(userSettings.language);
      }

    })
  }

  getLanguages(): string[] {
    return languages.map(l => l.name);
  }

  updateTranslation(language?: string) {
    language = language || 'English';

    const trans = allTranslations.find((el) => el.name === language) || allTranslations.find((el) => el.name === 'English');
    this.translations = trans.translations;

    const loc = languages.find((el) => el.name === language);
    this.locale = loc && loc.locale ? loc.locale : 'en';

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

  transformNumber(value) {
    if (value === null || value === undefined) return value;

    if (typeof value === 'string') {

      const appendMinus = value.indexOf('-') !== -1;
      if (appendMinus) {
        value = value.slice(1);
      }

      if (value.indexOf('$') !== -1) {
        return `${appendMinus ? '-' : ''}$${(+value.slice(1)).toLocaleString(this.locale || 'en')}`
      }

      if (value.indexOf('%') !== -1) {
        return `${appendMinus ? '-' : ''}${(+value.slice(0,-1)).toLocaleString(this.locale || 'en')}%`
      }

      return (appendMinus ? '-' : '') + (+value).toLocaleString(this.locale || 'en');
    }

    return value.toLocaleString(this.locale || 'en');
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
