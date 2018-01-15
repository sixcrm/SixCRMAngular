import {Pipe, PipeTransform, OnDestroy} from '@angular/core';
import {TranslationService} from './translation.service';
import {Subscription} from 'rxjs';

@Pipe({
  name: 'numberlocale',
  pure: false
})
export class NumberLocalePipe implements PipeTransform, OnDestroy {

  private sub: Subscription;
  private refresh: boolean = true;
  private value: string;
  private input: any;

  constructor(private translationService: TranslationService) {

    this.sub = this.translationService.translationChanged$.subscribe(() => {
      this.refresh = true;
    })

  };

  transform(value: any): any {
    if ((this.input || this.input === 0) && (this.input !== value)) {
      this.refresh = true;
    }

    if (!this.refresh) {
      return this.value;
    } else {
      this.input = value;
    }

    this.refresh = false;
    this.value = this.translationService.transformNumber(value);

    return this.value;
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
