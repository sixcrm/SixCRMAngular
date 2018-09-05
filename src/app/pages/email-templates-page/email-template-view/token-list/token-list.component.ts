import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {EmailTemplatesService} from '../../../../entity-services/services/email-templates.service';

@Component({
  selector: 'token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss']
})
export class TokenListComponent implements OnInit {

  @Input() tokenGroups: TokenGroup[] = [];
  @Input() selectedGroup: TokenGroup;

  filterString: string = '';

  @Output()
  tokenSelected: EventEmitter<Token> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

}

export class TokenGroup {

  name: string;
  description: string;
  tokens: Token[] = [];

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.name = obj.name || '';
    this.description = obj.description || '';
    this.tokens = (obj.tokens || []).map(t => new Token(t));
  }

}

export class Token {

  value: string;
  description: string;
  example: string;

  constructor(obj?: any) {
    if (!obj) {
      obj = {};
    }

    this.description = obj.description || '';
    this.value = obj.value || '';
    this.example = obj.example || '';
  }

  contains(filter: string) {
    return (this.value || '').toLowerCase().indexOf((filter || '').toLowerCase()) !== -1
      || (this.description || '').toLowerCase().indexOf((filter || '').toLowerCase()) !== -1;
  }

}
