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

export function scrollContentToTop(durationInMillis?: number): void {
  scrollToTop(scrollToTop(document.querySelector('.md-sidenav-content')), durationInMillis);
}
