import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {EmailTemplatesService} from '../../../../shared/services/email-templates.service';

@Component({
  selector: 'token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss']
})
export class TokenListComponent implements OnInit {

  tokens: Token[];
  loaded = false;
  tokenTypes: string[] = [];
  selectedType: string = '';
  filterString: string = '';

  @Output()
  tokenSelected: EventEmitter<Token> = new EventEmitter();

  constructor(private emailTemplatesService: EmailTemplatesService) { }

  ngOnInit() {
    this.emailTemplatesService.tokens.take(1).subscribe(tokens => {
      this.tokens = (tokens.properties || []).map(p => new Token(p, null, null));
      this.tokenTypes = this.tokens.map(t => t.path);

      this.loaded = true;
    });
    this.emailTemplatesService.getTokens();
  }

}

export class Token {
  name: string;
  path: string;
  subtokens: Token[] = [];
  parent: Token;
  isTerminal: boolean;

  constructor(obj: any, parent: Token, name: string) {
    this.parent = parent;

    this.name = (name && isNaN(+name)) ? name : obj.name || obj.title;
    this.name = this.name.replace(/\s/, '_');

    this.path = this.generatePath();

    this.parseSubtokens(obj);

    if (this.subtokens.length === 0) {
      this.isTerminal = true;
    }
  }

  private parseSubtokens(obj: any) {
    if (obj.anyOf) {
      obj.anyOf.forEach(element => {
        if (element.type === 'object') {
          obj.properties = element.properties;
        } else if (element.type !== 'array') {
          this.isTerminal = true;
        }
      })
    }

    if (obj.properties) {
      Object.keys(obj.properties).forEach(key => {
        if (obj.properties[key].type !== 'array'){
          this.subtokens.push(new Token(obj.properties[key], this, key));
        }
      })
    }
  }

  generatePath() {
    if (this.parent) {
      return this.parent.generatePath() + `.${this.name}`
    }

    return this.name;
  }

  contains(filter: string) {
    if (!filter) return true;

    return this.path.indexOf(filter) !== -1;
  }
}
