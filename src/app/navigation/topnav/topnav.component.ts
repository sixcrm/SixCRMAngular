import {Component, OnInit, Input} from '@angular/core';
import {MdSidenav} from '@angular/material';
import {NavigationService} from '../navigation.service';
import {Title} from '@angular/platform-browser';
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

  _showSidenav: boolean;
  _pageTitle: string;
  _browserTitle: string;
  _isLoadingRoute: boolean = false;
  _breadcrumbs: Array<{title: string, link: any[] | string}> = [];
  _autoBreadcrumbs: boolean = true;

  private _breadcrumbInterval: number;
  private _pageTitleInterval: number;

  _userProfile: User = new User();

  showDropdown: boolean = false;
  showCollapseMenu: boolean = false;
  showSearchInput: boolean = false;
  showAutoComplete: boolean = false;
  searchTerm: string = '';
  options: string[] = [];

  activeAcl: Acl = new Acl();
  showAcls: boolean = false;

  notificationsCount: number;

  constructor(
    public _navigation: NavigationService,
    private _title: Title,
    private _authService: AuthenticationService,
    private router: Router,
    private searchService: SearchService,
    private notificationsService: NotificationsQuickService
  ) {
  }

  ngOnInit() {
    this._navigation.isRouteLoading.subscribe(isRouteLoading => {
      this._isLoadingRoute = isRouteLoading;
    });
    this._navigation.showSidenav.subscribe(showSidenav => {
      this._showSidenav = showSidenav;
    });
    this._navigation.breadcrumbs.subscribe(breadcrumbs => {
      if(breadcrumbs !== null) {
        window.clearInterval(this._breadcrumbInterval);
        this._autoBreadcrumbs = false;
        this._breadcrumbs = breadcrumbs;
      } else {
        if(this._isLoadingRoute) {
          this._breadcrumbInterval = window.setInterval(() => {
            if(!this._isLoadingRoute) {
              window.clearInterval(this._breadcrumbInterval);
              this.updateAutoBreadcrumbs();
            }
          });
        } else {
          this.updateAutoBreadcrumbs();
        }
      }
    });
    this._navigation.pageTitle.subscribe(pageTitle => {
      if(pageTitle !== null) {
        window.clearInterval(this._pageTitleInterval);
        this._pageTitle = pageTitle;
        if(this._browserTitle === null) {
          this._title.setTitle(this._navigation.getAutoBrowserTitle(pageTitle));
        }
      } else {
        if(this._isLoadingRoute) {
          this._pageTitleInterval = window.setInterval(() => {
            if(!this._isLoadingRoute) {
              window.clearInterval(this._pageTitleInterval);
              this.updatePageTitle();
            }
          });
        } else {
          this.updatePageTitle();
        }
      }
    });
    this._navigation.browserTitle.subscribe(browserTitle => {
      this._browserTitle = browserTitle;
      if(browserTitle !== null) {
        this._title.setTitle(browserTitle);
      } else {
        this._title.setTitle(this._navigation.getAutoBrowserTitle(this._pageTitle));
      }
    });

    this._authService.sixUser$.subscribe((userProfile: User) => {
      if (userProfile) {
        this._userProfile = userProfile;
      }
    });

    this._authService.activeAcl$.subscribe((acl: Acl) => this.activeAcl = acl);

    this.searchService.suggestionResults$.subscribe(options => {
      this.options = options;
    });

    this.notificationsService.getNotificationCount();
    this.notificationsService.notificationCount$.subscribe((count: number) => {
      this.notificationsCount = count;
    });

    this.notificationsService.startPoolingNotifications();
  }

  logout(){
    this._authService.logout();
  }

  changeAcl(acl: Acl): void {
    this._authService.changeActiveAcl(acl);
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
    this._navigation.toggleSidenav(!this._showSidenav);
  }

  toggleAclsMenu(): void {
    this.showAcls = !this.showAcls;
  }

  toggleDropdownMenu(): void {
    this.showDropdown = !this.showDropdown;
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
    this.notificationsCount = 0;
    this._navigation.toggleNotifications(true);
  }

  private updateAutoBreadcrumbs() {
    this._navigation.currentRoute.take(1).subscribe(currentRoute => {
      this._autoBreadcrumbs = true;
      this._breadcrumbs = this._navigation.getAutoBreadcrumbs(currentRoute);
    });
  }

  private updatePageTitle() {
    this._navigation.currentRoute.take(1).subscribe(currentRoute => {
      this._pageTitle = this._navigation.getAutoPageTitle(currentRoute);
      if(this._browserTitle === null) {
        this._title.setTitle(this._navigation.getAutoBrowserTitle(this._pageTitle));
      }
    });
  }

  private hideElements(event): void {
    if (!event.target.attributes.class || event.target.attributes.class.value !== 'topnav__profile__arrow material-icons') {
      this.showDropdown = false;
    }

    if (!event.target.attributes.class || event.target.attributes.class.value !== 'topnav__acl__arrow material-icons') {
      this.showAcls = false;
    }

    if (!event.target.attributes.class || event.target.attributes.class.value !== 'topnav__items--collapsed__icon material-icons') {
      this.showCollapseMenu = false;
    }
  }
}
