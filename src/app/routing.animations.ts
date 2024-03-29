import {trigger, state, animate, style, transition} from '@angular/animations';

export function routerTransition(fixed?) {
  return fixed ? slideToLeft() : slideToLeftAbsolute();
}

export function slideToLeft() {
  return trigger('routerTransition', [
    transition(':enter', [
      style({transform: 'translateX(85%)', position: 'fixed', width: '100%'}),
      animate('335ms ease-in-out', style({transform: 'translateX(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateX(0%)', position: 'fixed', width: '100%'}),
      animate('335ms ease-in-out', style({transform: 'translateX(-100%)'}))
    ])
  ]);
}

export function slideToLeftAbsolute() {
  return trigger('routerTransition', [
    state('void', style({position: 'absolute', width: '100%'}) ),
    state('*', style({position: 'absolute', width: '100%'}) ),
    transition(':enter', [
      style({transform: 'translateX(100%)'}),
      animate('335ms ease-in-out', style({transform: 'translateX(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateX(0%)'}),
      animate('335ms ease-in-out', style({transform: 'translateX(-100%)'}))
    ])
  ]);
}
