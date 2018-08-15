import {Observable} from 'rxjs';

export function scrollToTop(element: any, durationInMillis?: number): void {
  if (!element) return;

  let duration = durationInMillis || 260;
  let interval = 20;
  let steps = duration / interval;
  let scrollStep = -element.scrollTop / steps;

  Observable.interval(interval).take(steps).subscribe(() => {
    if (element.scrollTop != 0) {
      element.scrollTop += scrollStep;
    }
  });
}

export function scrollToBottom(element: any, durationInMillis?: number): void {
  if (!element) return;

  let duration = durationInMillis || 260;
  let interval = 20;
  let steps = duration / interval;
  let scrollStep = element.scrollHeight / steps;

  Observable.interval(interval).take(steps).subscribe(() => {
    if (element.scrollTop < element.scrollHeight) {
      element.scrollTop += scrollStep;
    }
  });
}

export function scrollByX(element: any, scrollTo: number, durationInMillis?: number): void {
  if (!element && !element.nativeElement) return;

  const duration = durationInMillis || 160;
  const interval = 20;
  const steps = duration / interval;
  const scrollDistance = scrollTo - element.nativeElement.scrollLeft;
  const scrollStep = scrollDistance / steps;

  Observable.interval(interval).take(steps).subscribe((step) => {
    let scroll = element.nativeElement.scrollLeft + scrollStep;

    if (scroll < 0) {
      scroll = 0;
    }

    element.nativeElement.scrollLeft = scroll;

    if (step === steps - 1 && Math.abs(element.nativeElement.scrollLeft - scrollTo) < 8 ) {
      element.nativeElement.scrollLeft = scrollTo;
    }
  });
}

export function scrollContentToTop(durationInMillis?: number): void {
  scrollToTop(scrollToTop(document.querySelector('.mat-sidenav-content')), durationInMillis);
}
