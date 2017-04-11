import {Injectable} from '@angular/core';
import {Subject, BehaviorSubject} from 'rxjs';

@Injectable()
export class ProgressBarService {
  showTopProgressBar$: Subject<boolean> = new BehaviorSubject(false);

  constructor() {}

  public showTopProgressBar(): void {
    this.showTopProgressBar$.next(true);
  }

  public hideTopProgressBar(): void {
    this.showTopProgressBar$.next(false);
  }
}
