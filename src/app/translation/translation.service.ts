import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AuthenticationService} from '../authentication/authentication.service';
import {environment} from '../../environments/environment';
import {Http} from '@angular/http';
import {Notification} from '../shared/models/notification.model';
import {TranslatedQuote} from "./translated-quote.model";
import {utc} from 'moment';

export interface LanguageDefinition {
  name: string,
  locale: string
}

export interface LanguageTranslation {
  name: string,
  translations: {
    quotes: any,
    notifications: any,
    client: any
  }
}

@Injectable()
export class TranslationService {
  private allDefinitions: LanguageDefinition[] = [];
  private allTranslations: LanguageTranslation[] = [];

  private selectedTranslation: LanguageTranslation;
  private selectedDefinition: LanguageDefinition;

  public selectedLanguage: string;
  public translationChanged$: Subject<boolean> = new Subject();
  public allTranslationsFetched: Subject<boolean> = new Subject();

  constructor(private authService: AuthenticationService, private http: Http) {
    this.fetchLanguages();

    this.updateTranslation(this.authService.getUserSettings().language);

    this.authService.userSettings$.subscribe(userSettings => {

      if (userSettings && userSettings.language) {
        this.updateTranslation(userSettings.language);
      }

    })
  }

  fetchLanguages() {
    this.http.get(environment.translationsUrl).subscribe(res => {
      this.allDefinitions = res.json();

      this.allTranslationsFetched.next(true);
    });
  }

  getLanguages(): string[] {
    return this.allDefinitions.map(l => l.name);
  }

  updateTranslation(language?: string) {
    if (!this.allDefinitions || this.allDefinitions.length === 0) {
      this.allTranslationsFetched.take(1).subscribe(() => this.updateTranslation(language));
      return;
    }

    this.selectedLanguage = language || 'English';
    this.selectedDefinition = this.allDefinitions.find(el => el.name === language);

    const trans = this.allTranslations.find((el) => el.name === this.selectedLanguage);

    if (!trans) {
      this.http.get(environment.translationsUrl + this.selectedDefinition.locale.replace(/-/g, '_') +'.json').subscribe(res => {
        const newTranslations: LanguageTranslation = {name: language, translations: res.json()};
        this.allTranslations.push(newTranslations);

        this.updateTranslation(language);
      });
    } else {
      this.selectedTranslation = trans;

      this.translationChanged$.next(true);
    }
  }

  translate(value: string) {
    if (!this.selectedTranslation) return value;

    const keys = value.toLowerCase().split('_');

    let translation = value;

    try {
      translation = this.parseTranslation(this.selectedTranslation.translations.client, keys) || value;
    } catch (error) {
      // handle missing translation;
    }

    return translation;
  }

  translateNotificationName(value: string) {
    if (!this.selectedTranslation) return value;

    const keys = value.toLowerCase().split('%');

    let translation = value;

    try {
      translation = this.selectedTranslation.translations.notifications.six[keys[0]][keys[1]].name;
    } catch (error) {
      try {
        translation = this.selectedTranslation.translations.notifications.default[keys[0]][keys[1]].name
      } catch(er) {
        // handle missing translation
      }
    }

    return translation;
  }

  translateNotificationBody(notification: Notification) {
    const name = notification.name;

    const category = notification.category;

    let body;
    try {
      body = this.selectedTranslation.translations.notifications.six[category][name].body;
    } catch(err) {
      try {
        body = this.selectedTranslation.translations.notifications.default[category][name].body
      } catch(er) {
        console.log('TRANSLATION ERROR, cant find translation for notification:', category, '>', name);
        return name;
      }
    }

    const regex = /\{\{[a-z|.]+}}/g;
    let match;

    do {
      match = regex.exec(body);
      if (match && match[0]) {
        body = body.replace(match[0], notification.context[match[0].replace(/\{\{/, '').replace(/}}/, '')]);
      }
    } while (match);

    return body;
  }

  transformNumber(value) {
    if (!this.selectedDefinition) return value;

    if (value === null || value === undefined) return value;

    if (typeof value === 'string') {

      const appendMinus = value.indexOf('-') !== -1;
      if (appendMinus) {
        value = value.slice(1);
      }

      if (value.indexOf('$') !== -1) {
        return `${appendMinus ? '-' : ''}$${(+value.slice(1)).toLocaleString(this.selectedDefinition.locale || 'en')}`
      }

      if (value.indexOf('%') !== -1) {
        return `${appendMinus ? '-' : ''}${(+value.slice(0,-1)).toLocaleString(this.selectedDefinition.locale || 'en')}%`
      }

      return (appendMinus ? '-' : '') + (+value).toLocaleString(this.selectedDefinition.locale || 'en');
    }

    return value.toLocaleString(this.selectedDefinition.locale || 'en');
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

  getRandomQuote(): TranslatedQuote {
    if (!this.selectedTranslation) return null;

    const quotes = this.selectedTranslation.translations.quotes;
    const numberOfQuotes = quotes.length;
    const quoteIndex = utc().dayOfYear() % numberOfQuotes;

    return quotes[quoteIndex];
  }
}
