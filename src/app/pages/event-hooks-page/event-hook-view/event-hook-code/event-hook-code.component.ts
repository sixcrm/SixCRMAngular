import {Component, OnInit, ViewChild, Input, EventEmitter, Output} from '@angular/core';
import {EventHook} from '../../../../shared/models/event-hook.model';
import 'codemirror/mode/javascript/javascript';

@Component({
  selector: 'event-hook-code',
  templateUrl: './event-hook-code.component.html',
  styleUrls: ['./event-hook-code.component.scss']
})
export class EventHookCodeComponent implements OnInit {

  @Input() eventHook: EventHook;
  @Input() shared: boolean;
  @Output() save: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('codemirror') codemirror;

  config = {
    mode: {
      name: 'javascript',
      json: true
    },
    lineNumbers: true,
    theme: 'material',
    readOnly: !!this.shared
  };

  value: string[] = [];

  constructor() { }

  ngOnInit() { }

  execute() {
    let f = new Function('event',`
      const t = console.log;
      console.log = (value) => this.value = [...this.value, value]; 
      try { ${this.parseFunctionBody()}; } catch(error){ console.log(error) }
      console.log = t;`
    ).bind(this);

    f(this.getExampleEvent());
  }

  getExampleEvent() {
    switch (this.eventHook.eventType) {
      case 'click':
        return {
          id: '11111',
          campaign: {id: '1camp', name: 'first campaign'},
          product: {id: '1prod', name: 'first product'}
        };
      case 'lead':
        return {
          id: '22222',
          session: {id: '1sess', complete: false},
          campaign: {id: '1camp', name: 'first campaign'},
          product: {id: '1prod', name: 'first product'},
          customer: {id: '1cust', email: 'customer@example.com'}
        };
      case 'order':
        return {
          id: '33333',
          session: {id: '1sess', complete: false},
          campaign: {id: '1camp', name: 'first campaign'},
          product: {id: '1prod', name: 'first product'},
          customer: {id: '1cust', email: 'customer@example.com'},
          transaction: {id: '1trans'}
        };
      case 'confirm':
        return {
          id: '44444',
          session: {id: '1sess', complete: true},
          campaign: {id: '1camp', name: 'first campaign'},
          product: {id: '1prod', name: 'first product'},
          customer: {id: '1cust', email: 'customer@example.com'},
          transaction: {id: '1trans'}
        };
      default:
        return {id: '55555', key: 'Test Key', value: 'Test Value'}
    }
  }

  parseFunctionBody() {
    const f = this.eventHook.hookDecoded.indexOf('{');
    const l = this.eventHook.hookDecoded.lastIndexOf('}');

    return this.eventHook.hookDecoded.substring(f+1,l);
  }

  clearConsole() {
    this.value = [];
  }
}
