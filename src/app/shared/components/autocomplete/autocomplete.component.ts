import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {

  @Input() options: string[] = [];
  @Output() select: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() { }
}
