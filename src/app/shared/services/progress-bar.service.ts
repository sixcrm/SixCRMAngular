import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class ProgressBarService {
  showTopProgressBar$: Subject<boolean>;

  constructor() {
    this.showTopProgressBar$ = new Subject<boolean>();
  }

  public showTopProgressBar(): void {
    this.showTopProgressBar$.next(true);
  }

  public hideTopProgressBar(): void {
    this.showTopProgressBar$.next(false);
  }
}
