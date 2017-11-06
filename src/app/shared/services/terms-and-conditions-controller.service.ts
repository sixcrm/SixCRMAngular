import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class TermsAndConditionsControllerService {

  private _termsAndConditionsOutdated$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _isTermsAndConditionsOutdated: boolean = false;

  constructor() { }

  get termsAndConditionsOutdated$(): BehaviorSubject<boolean> {
    return this._termsAndConditionsOutdated$;
  }

  get isTermsAndConditionsOutdated(): boolean {
    return this._isTermsAndConditionsOutdated;
  }

  setTermsAndConditionsOutdated(value: boolean): void {
    this._termsAndConditionsOutdated$.next(value);
    this._isTermsAndConditionsOutdated = value;
  }
}
