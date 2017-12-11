import {Injectable} from '@angular/core';
import {TRANSLATIONS} from './translations/en';

@Injectable()
export class TranslationService {

  private translations;

  constructor() {
    this.loadTranslations();
  }

  translate(value: string) {
    if (!this.translations) {
      this.loadTranslations();
    }

    const keys = value.toLowerCase().split('_');

    let translation = value;

    try {
      translation = this.parseTranslation(this.translations, keys) || value;
    } catch (error) {
      // handle missing translation;
    }

    return translation;
  }

  loadTranslations(): void {
    this.translations = TRANSLATIONS;
  }

  parseTranslation(obj: any, keys: string[]): string {
    if (!keys || keys.length === 0) {
      return obj;
    }

    const key = keys.shift();

    return this.parseTranslation(obj[key], keys);
  }
}
