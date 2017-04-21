import {Injectable} from '@angular/core';
import {Subject, BehaviorSubject} from 'rxjs';

@Injectable()
export class ProgressBarService {
  showTopProgressBar$: Subject<boolean> = new BehaviorSubject(false);

  constructor() {}

  public showTopProgressBar(): void {
    setTimeout(() => {
      this.showTopProgressBar$.next(true);
    }, 1)
  }

  public hideTopProgressBar(): void {
    setTimeout(() => {
      this.showTopProgressBar$.next(false);
    }, 1)
  }
}
