import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../authentication/authentication.service";
import {User} from '../../shared/models/user.model';

@Component({
  selector: 'profile-page',
  templateUrl: 'profile-page.component.html',
  styleUrls: ['profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  private user: User = new User();
  private userCopy: User;
  private editing: boolean = false;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.userData$.subscribe((user: User) => {
      if (user) {
        this.user = user;
      }
    });
  }

  private toggleEdit(): void {
    this.editing = !this.editing;
    this.userCopy = this.user.copy();
  }

  private cancelEdit(): void {
    this.editing = false;
    this.user = this.userCopy;
  }

  private save(): void {

  }

}
