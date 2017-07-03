import {Component, OnInit, Input} from '@angular/core';
import {MdSidenav} from '@angular/material';
import {NavigationService} from '../navigation.service';
import {AuthenticationService} from "../../authentication/authentication.service";
import {StringUtils} from '../../shared/utils/string-utils';
import {Router} from '@angular/router';
import {User} from '../../shared/models/user.model';
import {Acl} from '../../shared/models/acl.model';
import {SearchService} from '../../shared/services/search.service';
import {NotificationsQuickService} from '../../shared/services/notifications-quick.service';

@Component({
  selector : 'app-topnav',
  templateUrl : './topnav.component.html',
  styleUrls : ['./topnav.component.scss'],
  host: {'(document:click)': 'hideElements($event)'},
})
export class TopnavComponent implements OnInit {
  @Input() sideNav: MdSidenav;

  showSidenav: boolean;

  userProfile: User = new User();

  showCollapseMenu: boolean = false;
  showSearchInput: boolean = false;
  showAutoComplete: boolean = false;
  searchTerm: string = '';
  options: string[] = [];

  notificationsCount: number;

  mapAcl = (acl: Acl) => acl.account.name;

  constructor(
    public navigation: NavigationService,
    public authService: AuthenticationService,
    private router: Router,
    private searchService: SearchService,
    private notificationsService: NotificationsQuickService
  ) { }

  ngOnInit() {
    this.navigation.showSidenav.subscribe(showSidenav => {
      this.showSidenav = showSidenav;
    });

    this.authService.sixUser$.subscribe((userProfile: User) => {
      if (userProfile) {
        this.userProfile = userProfile;
      }
    });

    this.searchService.suggestionResults$.subscribe(options => {
      this.options = options;
    });

    this.notificationsService.notificationCount$.subscribe((count: number) => {
      this.notificationsCount = count;
    });

    this.notificationsService.restartPoolingNotifications();
  }

  logout(){
    this.authService.logout();
  }

  changeAcl(acl: Acl): void {
    this.authService.changeActiveAcl(acl);
  }

  selectOption(option: string): void {
    this.searchTerm = option;
    this.search();
  }

  searchInputChanged(input): void {
    this.searchTerm = input.target.value;
    this.searchService.searchSuggestions(this.searchTerm);
  }

  searchInputBlur(): void {
    setTimeout(() => {
      if(StringUtils.isEmpty(this.searchTerm)) {
        this.showSearchInput = false;
      }

      this.showAutoComplete = false;
      this.options = [];
    }, 150);
  }

  searchInputFocus(): void {
    this.options = [];
    this.showAutoComplete = true;

    if (this.searchTerm) {
      this.searchService.searchSuggestions(this.searchTerm);
    }
  }

  onSearchKey(event): void {
    if (event.key === 'Enter' && this.searchTerm && this.searchTerm.length > 0) {
      this.search();
    }
  }

  search(): void {
    this.router.navigate(['/search'], {queryParams: {query: this.searchTerm}});
    this.searchTerm = '';
    this.showSearchInput = false;
  };

  toggleSidenav(): void {
    this.navigation.toggleSidenav(!this.showSidenav);
  }

  toggleCollapseMenu(): void {
    this.showCollapseMenu = !this.showCollapseMenu;
  }

  toggleSearchInput(input: HTMLInputElement): void {
    this.showSearchInput = !this.showSearchInput;
    if (this.showSearchInput) {
      window.setTimeout(() => {
        input.focus();
      }, 0);
    } else {
      this.searchTerm = '';
    }
  }

  navigateToProfile(): void {
    this.router.navigateByUrl('/profile');
  }

  showNotifications(): void {
    this.navigation.toggleNotifications(true);
  }

  private hideElements(event): void {
    if (!event.target.attributes.class || event.target.attributes.class.value !== 'topnav__items--collapsed__icon material-icons') {
      this.showCollapseMenu = false;
    }
  }
}
