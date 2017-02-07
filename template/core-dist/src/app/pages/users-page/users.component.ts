import { Component, OnInit } from '@angular/core';
import {User} from '../../shared/models/user';
import {UsersService} from '../../shared/services/users.service';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'c-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends AbstractEntityIndexComponent implements OnInit {

  private users: User[];

  constructor(private usersService: UsersService, router: Router, route: ActivatedRoute) {
    super(usersService, router, route);
  }

  ngOnInit() {
    this.usersService.entities$.subscribe((data) => this.users = data);
    this.usersService.getEntities();
  }

}
