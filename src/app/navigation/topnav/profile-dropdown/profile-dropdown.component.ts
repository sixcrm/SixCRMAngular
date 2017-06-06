import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {User} from '../../../shared/models/user.model';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss'],
  host: {'(document:click)': 'closeDropdown($event)'}
})
export class ProfileDropdownComponent implements OnInit {

  @Input() userProfile: User;
  dropdownVisible: boolean = false;

  constructor(private authService: AuthenticationService, private router: Router, private elementRef: ElementRef) { }

  ngOnInit() {
  }

  navigateToProfile(): void {
    this.router.navigateByUrl('/profile');
    this.dropdownVisible = false;
  }

  navigateToGraphDocs(): void {
    this.router.navigateByUrl('/documentation/graph');
    this.dropdownVisible = false;
  }

  logout(): void {
    this.authService.logout();
  }

  toggleDropdownMenu(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  closeDropdown(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownVisible = false;
    }
  }
}
