import { Component, OnInit } from '@angular/core';
import {NavigationService} from "../../navigation/navigation.service";
import {AuthenticationService} from "../../authentication/authentication.service";

@Component({
  selector: 'profile-page',
  templateUrl: 'profile-page.component.html',
  styleUrls: ['profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  private profile: any = {};

  constructor(private navigation: NavigationService, private authService: AuthenticationService) { }

  ngOnInit() {
    this.navigation.toggleSidenav(false);
    this.authService.profileData$.subscribe((profileData: any) => {
      this.profile = profileData;
      console.log(this.profile);
    });
    this.authService.getProfileData();
  }

}
