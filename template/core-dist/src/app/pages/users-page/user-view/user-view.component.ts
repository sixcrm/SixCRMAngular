import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../../shared/services/users.service';
import {ActivatedRoute, Params} from '@angular/router';
import {User} from '../../../shared/models/user';

@Component({
  selector: 'c-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {

  private user: User;

  constructor(private usersService: UsersService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.usersService.entity$.subscribe((data) => this.user = data);
    this.route.params.subscribe((params: Params) => this.usersService.getEntity(params['id']));
  }

}
