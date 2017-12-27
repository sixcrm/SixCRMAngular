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

  constructor(private translationService: TranslationService) {

    this.sub = this.translationService.translationChanged$.subscribe(() => {
      this.refresh = true;
    })

  };

  transform(value: string): any {
    if (!this.refresh) {
      return this.value;
    }

    this.refresh = false;
    this.value = this.translationService.translate(value);

    return this.value;
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
