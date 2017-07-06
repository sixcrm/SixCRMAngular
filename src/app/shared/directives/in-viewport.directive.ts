import {Directive, Output, EventEmitter, ElementRef, OnDestroy, AfterViewInit} from '@angular/core';
import {Observable, AsyncSubject} from 'rxjs';
import {AuthenticationService} from '../../authentication/authentication.service';

@Directive({
  selector: '[inViewport]'
})
export class InViewportDirective implements AfterViewInit, OnDestroy{

  @Output('inside') inside: EventEmitter<boolean> = new EventEmitter();

  private unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();
  private registrationInProcess: boolean = false;

  constructor(private elementRef: ElementRef, private authService: AuthenticationService) {
    this.authService.sixUserActivated$.takeUntil(this.unsubscribe$).subscribe(activated => this.registrationInProcess = !activated);
  }

  ngAfterViewInit(): void {
    if (this.isVisible()) {
      this.inside.emit(true);
    }

    Observable.interval(250).takeUntil(this.unsubscribe$).subscribe(() => {
      if (this.isVisible()) {
        this.inside.emit(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  isVisible(): boolean {
    if (this.registrationInProcess) return true;

    let el = this.elementRef.nativeElement;
    let fromPoint = (x, y) => document.elementFromPoint(x, y);

    let rect = el.getBoundingClientRect();
    let vWidth = window.innerWidth || document.documentElement.clientWidth;
    let vHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight) {
      return false;
    }

    return (
      el.contains(fromPoint(rect.left,  rect.top))
      ||  el.contains(fromPoint(rect.right, rect.top))
      ||  el.contains(fromPoint(rect.right, rect.bottom))
      ||  el.contains(fromPoint(rect.left,  rect.bottom))
    );
  }

}
