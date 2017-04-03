import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../authentication/authentication.service";
import {User} from '../../shared/models/user.model';

@Component({
  selector: 'profile-page',
  templateUrl: 'profile-page.component.html',
  styleUrls: ['profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  user: User = new User();
  userCopy: User;
  editing: boolean = false;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.userData$.subscribe((user: User) => {
      if (user) {
        this.user = user;
      }
    });
  }

  toggleEdit(): void {
    this.editing = !this.editing;
    this.userCopy = this.user.copy();
  }

  cancelEdit(): void {
    this.editing = false;
    this.user = this.userCopy;
  }

  save(): void {

  }

}
