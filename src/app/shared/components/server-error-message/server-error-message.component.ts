import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'server-error-message',
  templateUrl: './server-error-message.component.html',
  styleUrls: ['./server-error-message.component.scss']
})
export class ServerErrorMessageComponent implements OnInit {

  @Output() refresh: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  emitRefresh() {
    this.refresh.emit(true);
  }
}
