import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AsyncSubject} from "rxjs/AsyncSubject";

@Component({
  selector: 'state-machine-live',
  templateUrl: './state-machine-live.component.html',
  styleUrls: ['./state-machine-live.component.scss']
})
export class StateMachineLiveComponent implements OnInit, OnDestroy {

  queueName: string;

  private unsubscribe$: AsyncSubject<boolean> = new AsyncSubject();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.takeUntil(this.unsubscribe$).subscribe(params => {
      if (params && params['queue']) {
        this.queueName = params['queue'];
      }
    })
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
