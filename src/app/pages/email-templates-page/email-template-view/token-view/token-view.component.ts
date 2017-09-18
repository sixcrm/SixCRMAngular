import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Token} from '../token-list/token-list.component';

@Component({
  selector: 'token-view',
  templateUrl: './token-view.component.html',
  styleUrls: ['./token-view.component.scss']
})
export class TokenViewComponent implements OnInit {

  @Input() token: Token;
  @Input() filter: string;

  @Output() tokenSelected: EventEmitter<Token> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
