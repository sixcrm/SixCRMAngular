import { Component, OnInit } from '@angular/core';
import {NavigationService} from "../../navigation/navigation.service";
import {AuthenticationService} from "../../authentication/authentication.service";
import {Profile} from "../../shared/models/profile.model";

@Component({
  selector: 'profile-page',
  templateUrl: 'profile-page.component.html',
  styleUrls: ['profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  private profile: Profile = new Profile();
  private profileCopy: Profile;
  private editing: boolean = false;

  constructor(private navigation: NavigationService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.profileData$.subscribe((profileData: any) => {
      if (profileData) {
        this.profile = new Profile(profileData);
      }
    });
    this.authService.getProfileData();
  }

  private toggleEdit(): void {
    this.editing = !this.editing;
    this.profileCopy = this.profile.copy();
  }

  private cancelEdit(): void {
    this.editing = false;
    this.profile = this.profileCopy;
  }

  private save(): void {

  }

}
