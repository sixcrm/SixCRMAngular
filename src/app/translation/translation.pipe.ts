import {Pipe, PipeTransform, OnDestroy} from '@angular/core';
import {TranslationService} from './translation.service';
import {Subscription} from 'rxjs';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslationPipe implements PipeTransform, OnDestroy {

  private sub: Subscription;
  private refresh: boolean = true;
  private value: string;
  private input: string;

  constructor(private translationService: TranslationService) {

    this.sub = this.translationService.translationChanged$.subscribe(() => {
      this.refresh = true;
    })

  };

  transform(value: string, mode?: 'standard' | 'notification-name'): any {
    if (this.input !== value) {
      this.refresh = true;
    }

    if (!this.refresh) {
      return this.value;
    } else {
      this.input = value;
    }

    this.refresh = false;

    if (mode) {
      if (mode === 'notification-name') {
        this.value = this.translationService.translateNotificationName(value);
      } else {
        this.value = this.translationService.translate(value);
      }
    } else {
      this.value = this.translationService.translate(value);
    }

    return this.value;
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
